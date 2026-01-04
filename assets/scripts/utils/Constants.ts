/**
 * 游戏常量定义
 * 集中管理所有常量，便于维护和修改
 */
export class Constants {
    /** 设计分辨率宽度 */
    static readonly kDesignWidth: number = 1080;
    /** 设计分辨率高度 */
    static readonly kDesignHeight: number = 2080;
    
    /** 主牌区宽度 */
    static readonly kPlayfieldWidth: number = 1080;
    /** 主牌区高度 */
    static readonly kPlayfieldHeight: number = 1500;
    
    /** 堆牌区宽度 */
    static readonly kStackAreaWidth: number = 1080;
    /** 堆牌区高度 */
    static readonly kStackAreaHeight: number = 580;
    
    /** 卡牌移动动画时长（秒） */
    static readonly kCardMoveDuration: number = 0.3;
    /** 卡牌翻牌动画时长（秒） */
    static readonly kCardFlipDuration: number = 0.3;
    
    /** 匹配规则：点数差值 */
    static readonly kMatchValueDiff: number = 1;
    
    /** 资源路径 */
    static readonly kResourcePaths = {
        /** 关卡配置路径 */
        levelConfig: 'configs/level',
        /** 卡牌图片路径 */
        cardFaces: 'cards/faces',
        /** 卡牌背面路径 */
        cardBack: 'cards/back'
    };
}

