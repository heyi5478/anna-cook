import { Page, BrowserContext } from '@playwright/test';

// 效能指標介面
type PerformanceMetrics = {
  loadTime: number;
  firstFrame: number;
  bufferingEvents: number;
  bufferingDuration: number;
  seekAccuracy: number;
  memoryUsage: number;
  cpuUsage: number;
  networkActivity: NetworkMetrics;
  frameDrops: number;
  playbackStalls: number;
};

// 網路指標介面
type NetworkMetrics = {
  totalRequests: number;
  totalBytes: number;
  averageSpeed: number;
  slowestRequest: number;
  fastestRequest: number;
  failedRequests: number;
};

// 視頻效能指標介面
type VideoPerformanceMetrics = {
  decodedFrames: number;
  droppedFrames: number;
  corruptedFrames: number;
  frameRate: number;
  bitrate: number;
  bufferHealth: number;
  videoResolution: {
    width: number;
    height: number;
  };
};

// 效能監控配置介面
type PerformanceMonitoringConfig = {
  enabled: boolean;
  collectInterval: number;
  thresholds: PerformanceThresholds;
  reportPath: string;
  autoScreenshot: boolean;
};

// 效能閾值介面
type PerformanceThresholds = {
  maxLoadTime: number;
  maxBufferingEvents: number;
  maxMemoryUsage: number;
  minFrameRate: number;
  maxFrameDropRate: number;
};

// 預設配置
const DEFAULT_CONFIG: PerformanceMonitoringConfig = {
  enabled: true,
  collectInterval: 1000, // 每秒收集一次
  thresholds: {
    maxLoadTime: 5000, // 5秒
    maxBufferingEvents: 3,
    maxMemoryUsage: 500 * 1024 * 1024, // 500MB
    minFrameRate: 24, // 最低 24fps
    maxFrameDropRate: 0.05, // 最多 5% 丟幀
  },
  reportPath: 'test-results/performance',
  autoScreenshot: true,
};

// 效能監控器類別
class PerformanceMonitor {
  private page: Page;

  private config: PerformanceMonitoringConfig;

  private metrics: PerformanceMetrics[];

  private startTime: number;

  private intervalId?: NodeJS.Timeout;

  private networkRequests: any[];

  constructor(page: Page, config: Partial<PerformanceMonitoringConfig> = {}) {
    this.page = page;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metrics = [];
    this.startTime = 0;
    this.networkRequests = [];
  }

  /**
   * 開始效能監控
   */
  async start(): Promise<void> {
    if (!this.config.enabled) return;

    this.startTime = Date.now();

    // 監聽網路請求
    this.page.on('request', (request) => {
      this.networkRequests.push({
        url: request.url(),
        method: request.method(),
        startTime: Date.now(),
      });
    });

    this.page.on('response', (response) => {
      const request = this.networkRequests.find(
        (req) => req.url === response.url() && !req.endTime,
      );
      if (request) {
        request.endTime = Date.now();
        request.status = response.status();
        request.size = response.headers()['content-length'] || 0;
      }
    });

    // 設定定期收集指標
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, this.config.collectInterval);

    // 注入效能監控腳本
    await this.injectMonitoringScript();
  }

  /**
   * 停止效能監控
   */
  async stop(): Promise<PerformanceMetrics> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // 收集最終指標
    const finalMetrics = await this.collectMetrics();

    // 生成報告
    if (this.config.reportPath) {
      await this.generateReport();
    }

    return finalMetrics;
  }

  /**
   * 注入效能監控腳本到頁面
   */
  private async injectMonitoringScript(): Promise<void> {
    await this.page.addInitScript(() => {
      // 建立全域效能監控物件
      (window as any).performanceMonitor = {
        videoMetrics: {
          decodedFrames: 0,
          droppedFrames: 0,
          corruptedFrames: 0,
          frameRate: 0,
          bufferingEvents: [],
          stallEvents: [],
        },

        // 監控視頻元素
        monitorVideo(video: HTMLVideoElement) {
          if (!video) return;

          // 監控緩衝事件
          video.addEventListener('waiting', () => {
            this.videoMetrics.bufferingEvents.push({
              time: Date.now(),
              currentTime: video.currentTime,
            });
          });

          // 監控播放停頓
          video.addEventListener('stalled', () => {
            this.videoMetrics.stallEvents.push({
              time: Date.now(),
              currentTime: video.currentTime,
            });
          });

          // 監控幀統計（如果支援）
          if ('getVideoPlaybackQuality' in video) {
            setInterval(() => {
              const quality = (video as any).getVideoPlaybackQuality();
              this.videoMetrics.decodedFrames = quality.totalVideoFrames;
              this.videoMetrics.droppedFrames = quality.droppedVideoFrames;
              this.videoMetrics.corruptedFrames = quality.corruptedVideoFrames;
            }, 1000);
          }
        },

        // 獲取當前指標
        getMetrics() {
          return {
            ...this.videoMetrics,
            memory: (performance as any).memory
              ? {
                  used: (performance as any).memory.usedJSHeapSize,
                  total: (performance as any).memory.totalJSHeapSize,
                  limit: (performance as any).memory.jsHeapSizeLimit,
                }
              : null,
            navigation: performance.getEntriesByType('navigation')[0],
            paint: performance.getEntriesByType('paint'),
          };
        },
      };

      // 自動監控所有視頻元素
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'VIDEO') {
                (window as any).performanceMonitor.monitorVideo(element);
              }
              // 查找子元素中的視頻
              const videos = element.querySelectorAll('video');
              videos.forEach((video) => {
                (window as any).performanceMonitor.monitorVideo(video);
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // 監控現有的視頻元素
      document.querySelectorAll('video').forEach((video) => {
        (window as any).performanceMonitor.monitorVideo(video);
      });
    });
  }

  /**
   * 收集效能指標
   */
  private async collectMetrics(): Promise<PerformanceMetrics> {
    const pageMetrics = await this.page.evaluate(() => {
      return (window as any).performanceMonitor?.getMetrics() || {};
    });

    const networkMetrics = this.calculateNetworkMetrics();

    const metrics: PerformanceMetrics = {
      loadTime: Date.now() - this.startTime,
      firstFrame:
        pageMetrics.paint?.find((p: any) => p.name === 'first-contentful-paint')
          ?.startTime || 0,
      bufferingEvents: pageMetrics.bufferingEvents?.length || 0,
      bufferingDuration: this.calculateBufferingDuration(
        pageMetrics.bufferingEvents || [],
      ),
      seekAccuracy: 0, // 需要具體測試來設定
      memoryUsage: pageMetrics.memory?.used || 0,
      cpuUsage: 0, // 瀏覽器無法直接獲取
      networkActivity: networkMetrics,
      frameDrops: pageMetrics.droppedFrames || 0,
      playbackStalls: pageMetrics.stallEvents?.length || 0,
    };

    this.metrics.push(metrics);

    // 檢查是否超過閾值
    await this.checkThresholds(metrics);

    return metrics;
  }

  /**
   * 計算網路指標
   */
  private calculateNetworkMetrics(): NetworkMetrics {
    const completedRequests = this.networkRequests.filter((req) => req.endTime);

    return {
      totalRequests: this.networkRequests.length,
      totalBytes: completedRequests.reduce(
        (sum, req) => sum + (req.size || 0),
        0,
      ),
      averageSpeed:
        completedRequests.length > 0
          ? completedRequests.reduce(
              (sum, req) => sum + (req.endTime - req.startTime),
              0,
            ) / completedRequests.length
          : 0,
      slowestRequest: Math.max(
        ...completedRequests.map((req) => req.endTime - req.startTime),
        0,
      ),
      fastestRequest: Math.min(
        ...completedRequests.map((req) => req.endTime - req.startTime),
        Infinity,
      ),
      failedRequests: this.networkRequests.filter((req) => req.status >= 400)
        .length,
    };
  }

  /**
   * 計算緩衝持續時間
   */
  private calculateBufferingDuration(bufferingEvents: any[]): number {
    // 簡化計算，實際可能需要更複雜的邏輯
    // 使用實例屬性來記錄基準時間
    const baseTime = this.startTime;
    if (baseTime === 0) {
      return bufferingEvents.length * 1000; // 假設每次緩衝 1 秒
    }
    return bufferingEvents.length * 1000; // 假設每次緩衝 1 秒
  }

  /**
   * 檢查效能閾值
   */
  private async checkThresholds(metrics: PerformanceMetrics): Promise<void> {
    const violations: string[] = [];

    if (metrics.loadTime > this.config.thresholds.maxLoadTime) {
      violations.push(
        `載入時間超過閾值: ${metrics.loadTime}ms > ${this.config.thresholds.maxLoadTime}ms`,
      );
    }

    if (metrics.bufferingEvents > this.config.thresholds.maxBufferingEvents) {
      violations.push(
        `緩衝事件超過閾值: ${metrics.bufferingEvents} > ${this.config.thresholds.maxBufferingEvents}`,
      );
    }

    if (metrics.memoryUsage > this.config.thresholds.maxMemoryUsage) {
      violations.push(
        `記憶體使用超過閾值: ${metrics.memoryUsage} > ${this.config.thresholds.maxMemoryUsage}`,
      );
    }

    if (violations.length > 0 && this.config.autoScreenshot) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await this.page.screenshot({
        path: `${this.config.reportPath}/violation-${timestamp}.png`,
        fullPage: true,
      });
    }
  }

  /**
   * 生成效能報告
   */
  private async generateReport(): Promise<void> {
    const report = {
      testDuration: Date.now() - this.startTime,
      metricsCount: this.metrics.length,
      summary: this.calculateSummary(),
      detailedMetrics: this.metrics,
      networkActivity: this.networkRequests,
      thresholds: this.config.thresholds,
    };

    // 這裡可以生成 HTML 報告或 JSON 檔案
    console.log('效能報告:', JSON.stringify(report, null, 2));
  }

  /**
   * 計算摘要統計
   */
  private calculateSummary() {
    if (this.metrics.length === 0) return {};

    return {
      averageLoadTime:
        this.metrics.reduce((sum, m) => sum + m.loadTime, 0) /
        this.metrics.length,
      totalBufferingEvents: this.metrics.reduce(
        (sum, m) => sum + m.bufferingEvents,
        0,
      ),
      maxMemoryUsage: Math.max(...this.metrics.map((m) => m.memoryUsage)),
      totalFrameDrops: this.metrics.reduce((sum, m) => sum + m.frameDrops, 0),
      totalPlaybackStalls: this.metrics.reduce(
        (sum, m) => sum + m.playbackStalls,
        0,
      ),
    };
  }
}

/**
 * 設定效能監控
 */
async function setupPerformanceMonitoring(
  page: Page,
  config: Partial<PerformanceMonitoringConfig> = {},
): Promise<PerformanceMonitor> {
  const monitor = new PerformanceMonitor(page, config);
  await monitor.start();
  return monitor;
}

/**
 * 為瀏覽器上下文設定效能監控
 */
async function setupContextPerformanceMonitoring(
  context: BrowserContext,
  config: Partial<PerformanceMonitoringConfig> = {},
): Promise<void> {
  // 為新頁面自動設定效能監控
  context.on('page', async (page) => {
    await setupPerformanceMonitoring(page, config);
  });
}

/**
 * 獲取視頻效能指標
 */
async function getVideoPerformanceMetrics(
  page: Page,
): Promise<VideoPerformanceMetrics> {
  return page.evaluate(() => {
    const video = document.querySelector('video');
    if (!video) {
      throw new Error('找不到視頻元素');
    }

    const quality = (video as any).getVideoPlaybackQuality?.() || {};

    return {
      decodedFrames: quality.totalVideoFrames || 0,
      droppedFrames: quality.droppedVideoFrames || 0,
      corruptedFrames: quality.corruptedVideoFrames || 0,
      frameRate: 0, // 需要計算
      bitrate: 0, // 需要從網路請求獲取
      bufferHealth:
        video.buffered.length > 0
          ? video.buffered.end(video.buffered.length - 1) - video.currentTime
          : 0,
      videoResolution: {
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      },
    };
  });
}

export {
  PerformanceMonitor,
  setupPerformanceMonitoring,
  setupContextPerformanceMonitoring,
  getVideoPerformanceMetrics,
  DEFAULT_CONFIG,
  type PerformanceMetrics,
  type NetworkMetrics,
  type VideoPerformanceMetrics,
  type PerformanceMonitoringConfig,
  type PerformanceThresholds,
};
