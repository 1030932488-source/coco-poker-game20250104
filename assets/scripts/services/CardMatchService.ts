import { CardModel } from '../models/CardModel';

/**
 * 卡牌匹配服务
 * 提供卡牌匹配相关的业务逻辑判断
 * 这是一个无状态服务，不持有数据
 */
export class CardMatchService {
    /**
     * 判断两张卡牌是否可以匹配
     * 规则：数字必须比底牌数字大1或小1，无花色限制
     * @param baseCard 底牌
     * @param targetCard 目标卡牌
     * @returns 是否可以匹配
     */
    static canMatch(baseCard: CardModel, targetCard: CardModel): boolean {
        if (!baseCard || !targetCard) {
            return false;
        }

        const baseValue = baseCard.getValue();
        const targetValue = targetCard.getValue();

        // 判断数值差是否为1
        const diff = Math.abs(baseValue - targetValue);
        return diff === 1;
    }

    /**
     * 检查主牌区是否有可匹配的卡牌
     * @param baseCard 底牌
     * @param playfieldCards 主牌区的卡牌列表
     * @returns 是否有可匹配的卡牌
     */
    static hasMatchableCard(baseCard: CardModel | null, playfieldCards: CardModel[]): boolean {
        if (!baseCard) {
            return false;
        }

        return playfieldCards.some(card => {
            return card.isFaceUp && this.canMatch(baseCard, card);
        });
    }
}

