// require('dotenv').config()
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
function getPrices() {
	axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=cryptoblades`).then(res => {
		if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
			let currentPrice = res.data[0].current_price || 0 
			let priceChange = res.data[0].price_change_percentage_24h || 0 
			let symbol = res.data[0].symbol || '?' 
			priceChange = priceChange.toFixed(2);
			let upordown = "";
			if (priceChange > 0){
				upordown = "increased "
			}
			else{
				upordown = "decreased "
			}
			client.user.setPresence({
				game: {

					name: `${upordown}${priceChange}%`,
					type: 3 
				}
			})

			client.guilds.find(guild => guild.id === process.env.SERVER_ID1).me.setNickname(`$${(currentPrice*0.93).toLocaleString(undefined, {minimumFractionDigits:3}).replace(/,/g,",")}/SKILL`)
			client.guilds.find(guild => guild.id === process.env.SERVER_ID2).me.setNickname(`$${(currentPrice*0.93).toLocaleString(undefined, {minimumFractionDigits:3}).replace(/,/g,",")}/SKILL`)
			console.log('Updated price to', currentPrice)
		}
		else
			console.log('Could not load player count data for SKILL')

	}).catch(err => console.log('Error at api.coingecko.com data:', err))
}
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrices()
	setInterval(getPrices, Math.max(1, 5 || 1) * 60 * 1000)
})


client.login(process.env.DISCORD_TOKEN)
