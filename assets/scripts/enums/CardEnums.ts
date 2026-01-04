/**
 * 卡牌花色枚举
 */
export enum CardSuitType {
    NONE = -1,
    CLUBS = 0,      // 梅花
    DIAMONDS = 1,   // 方块
    HEARTS = 2,     // 红桃
    SPADES = 3,     // 黑桃
    NUM_CARD_SUIT_TYPES = 4
}

/**
 * 卡牌点数枚举
 */
export enum CardFaceType {
    NONE = -1,
    ACE = 0,        // A
    TWO = 1,        // 2
    THREE = 2,      // 3
    FOUR = 3,       // 4
    FIVE = 4,       // 5
    SIX = 5,        // 6
    SEVEN = 6,      // 7
    EIGHT = 7,      // 8
    NINE = 8,       // 9
    TEN = 9,        // 10
    JACK = 10,      // J
    QUEEN = 11,     // Q
    KING = 12,      // K
    NUM_CARD_FACE_TYPES = 13
}

