import { CardSuitType, CardFaceType } from '../../enums/CardEnums';

/**
 * 关卡配置数据接口
 * 用于存储静态关卡配置信息
 */
export interface LevelConfig {
    Playfield: CardConfig[];
    Stack: CardConfig[];
}

/**
 * 卡牌配置数据接口
 */
export interface CardConfig {
    CardFace: CardFaceType;
    CardSuit: CardSuitType;
    Position: { x: number; y: number };
}

