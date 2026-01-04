/**
 * 回退操作类型枚举
 */
export enum UndoActionType {
    PLAYFIELD_TO_BASE = 'PLAYFIELD_TO_BASE', // 主牌区 -> 底牌（匹配）
    STACK_TO_BASE = 'STACK_TO_BASE'          // 备用牌堆 -> 底牌（抽牌）
}

/**
 * 回退数据模型
 * 存储每一步操作的信息，用于撤销功能
 */
export class UndoModel {
    /** 操作类型 */
    public actionType: UndoActionType;
    /** 本次移动到“底牌区”的卡牌ID */
    public movedCardId: number;
    /** 操作前的底牌ID（用于校验/调试，可为空） */
    public previousBaseCardId: number | null;
    /** 操作前该卡牌是否翻开（抽牌回退需要恢复为背面） */
    public movedCardPreviousIsFaceUp: boolean;

    constructor(
        actionType: UndoActionType,
        movedCardId: number,
        previousBaseCardId: number | null = null,
        movedCardPreviousIsFaceUp: boolean
    ) {
        this.actionType = actionType;
        this.movedCardId = movedCardId;
        this.previousBaseCardId = previousBaseCardId;
        this.movedCardPreviousIsFaceUp = movedCardPreviousIsFaceUp;
    }

    /**
     * 序列化（用于存档）
     */
    public serialize(): any {
        return {
            actionType: this.actionType,
            movedCardId: this.movedCardId,
            previousBaseCardId: this.previousBaseCardId,
            movedCardPreviousIsFaceUp: this.movedCardPreviousIsFaceUp
        };
    }

    /**
     * 反序列化（用于读档）
     */
    public static deserialize(data: any): UndoModel {
        return new UndoModel(
            data.actionType,
            data.movedCardId,
            data.previousBaseCardId,
            data.movedCardPreviousIsFaceUp
        );
    }
}

