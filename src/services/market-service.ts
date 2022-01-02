import axios from 'axios';
import { MARKET_API } from '../constants/network';
import logger from "../logger";

export const getUSDValue = async (tokenId: string) => {
    try {
        const url = `${MARKET_API.marketDataApiUrl}/${tokenId}`;
        const response = await axios.get(url);
        const currentTokenData = response.data;
        return {
            currentUSDPrice: currentTokenData.market_data.current_price.usd,
            description: currentTokenData.description.en,
            chatUrl: currentTokenData.chat_url,
            error: false,
        };
    } catch (err) {
        logger.error("Error when getting market price");
        return {
            currentUSDPrice: 0,
            error: true,
        };
    }
};
