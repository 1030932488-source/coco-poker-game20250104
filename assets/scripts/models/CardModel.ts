import { CardSuitType, CardFaceType } from '../enums/CardEnums';
import { Vec3 } from 'cc';

/**
 * 卡牌数据模型
 * 存储卡牌的基本信息和状态
 */
export class CardModel {
    /** 卡牌唯一ID */
    public id: number;
    /** 卡牌点数 */
    public face: CardFaceType;
    /** 卡牌花色 */
    public suit: CardSuitType;
    /** 卡牌“归位”位置（用于主牌区/牌堆回退回原位） */
    public position: Vec3;
    /** 是否翻开（正面朝上） */
    public isFaceUp: boolean;

    constructor(id: number, face: CardFaceType, suit: CardSuitType, position: Vec3, isFaceUp: boolean = false) {
        this.id = id;
        this.face = face;
        this.suit = suit;
        this.position = position.clone();
        this.isFaceUp = isFaceUp;
    }

    /**
     * 序列化（用于存档）
     */
    public serialize(): any {
        return {
            id: this.id,
            face: this.face,
            suit: this.suit,
            position: { x: this.position.x, y: this.position.y, z: this.position.z },
            isFaceUp: this.isFaceUp
        };
    }

    /**
     * 反序列化（用于读档）
     */
    public static deserialize(data: any): CardModel {
        const card = new CardModel(
            data.id,
            data.face,
            data.suit,
            new Vec3(data.position.x, data.position.y, data.position.z ?? 0),
            data.isFaceUp
        );
        return card;
    }

    /**
     * 获取卡牌数值（用于匹配判断）
     */
    public getValue(): number {
        return this.face;
    }
}

