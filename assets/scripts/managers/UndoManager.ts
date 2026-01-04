import { UndoModel } from '../models/UndoModel';

/**
 * 回退管理器
 * 负责管理游戏的回退（撤销）功能
 * 作为Controller的成员变量，可持有Model数据，禁止单例
 */
export class UndoManager {
    /** 回退记录栈 */
    private _undoStack: UndoModel[] = [];

    /**
     * 添加回退记录
     * @param undoModel 回退数据模型
     */
    public addUndoRecord(undoModel: UndoModel): void {
        this._undoStack.push(undoModel);
    }

    /**
     * 弹出一条回退记录
     * Controller 负责根据记录执行具体的 Model 回滚与 View 动画
     */
    public popUndoRecord(): UndoModel | null {
        return this._undoStack.length > 0 ? this._undoStack.pop()! : null;
    }

    /**
     * 清空回退记录
     */
    public clear(): void {
        this._undoStack = [];
    }

    /**
     * 获取回退记录数量
     */
    public getUndoCount(): number {
        return this._undoStack.length;
    }
}

