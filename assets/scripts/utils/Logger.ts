/**
 * 日志工具类
 * 提供统一的日志输出功能
 */
export class Logger {
    private static _enableLog: boolean = true;
    private static _enableError: boolean = true;
    private static _enableWarn: boolean = true;

    /**
     * 设置日志开关
     * @param enableLog 是否启用普通日志
     * @param enableError 是否启用错误日志
     * @param enableWarn 是否启用警告日志
     */
    static setLogEnabled(enableLog: boolean, enableError: boolean = true, enableWarn: boolean = true): void {
        this._enableLog = enableLog;
        this._enableError = enableError;
        this._enableWarn = enableWarn;
    }

    /**
     * 输出普通日志
     * @param message 日志消息
     * @param args 额外参数
     */
    static log(message: string, ...args: any[]): void {
        if (this._enableLog) {
            console.log(`[LOG] ${message}`, ...args);
        }
    }

    /**
     * 输出错误日志
     * @param message 错误消息
     * @param args 额外参数
     */
    static error(message: string, ...args: any[]): void {
        if (this._enableError) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }

    /**
     * 输出警告日志
     * @param message 警告消息
     * @param args 额外参数
     */
    static warn(message: string, ...args: any[]): void {
        if (this._enableWarn) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    /**
     * 输出调试日志
     * @param message 调试消息
     * @param args 额外参数
     */
    static debug(message: string, ...args: any[]): void {
        if (this._enableLog) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
}

