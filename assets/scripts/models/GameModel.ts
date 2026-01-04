import { CardModel } from './CardModel';

/**
 * 游戏数据模型
 * 存储游戏的整体状态和数据
 */
export class GameModel {
    /** 主牌区的卡牌列表 */
    public playfieldCards: CardModel[] = [];
    /** 备用牌堆的卡牌列表 */
    public stackCards: CardModel[] = [];
    /** 底牌（废牌堆）历史，最后一张为当前底牌 */
    public wasteCards: CardModel[] = [];
    /** 当前底牌（顶部牌） */
    public baseCard: CardModel | null = null;
    /** 游戏是否结束 */
    public isGameOver: boolean = false;
    /** 游戏是否胜利 */
    public isWin: boolean = false;

    /**
     * 序列化（用于存档）
     */
    public serialize(): any {
        return {
            playfieldCards: this.playfieldCards.map(card => card.serialize()),
            stackCards: this.stackCards.map(card => card.serialize()),
            wasteCards: this.wasteCards.map(card => card.serialize()),
            isGameOver: this.isGameOver,
            isWin: this.isWin
        };
    }

    /**
     * 反序列化（用于读档）
     */
    public static deserialize(data: any): GameModel {
        const model = new GameModel();
        model.playfieldCards = data.playfieldCards.map((cardData: any) => CardModel.deserialize(cardData));
        model.stackCards = data.stackCards.map((cardData: any) => CardModel.deserialize(cardData));
        model.wasteCards = (data.wasteCards ?? []).map((cardData: any) => CardModel.deserialize(cardData));
        model.refreshBaseCard();
        model.isGameOver = data.isGameOver;
        model.isWin = data.isWin;
        return model;
    }

    /**
     * 刷新当前底牌引用：baseCard 永远指向 wasteCards 的最后一张
     */
    public refreshBaseCard(): void {
        this.baseCard = this.wasteCards.length > 0 ? this.wasteCards[this.wasteCards.length - 1] : null;
    }
}

