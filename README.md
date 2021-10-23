# crossout-craft-calculator
Receives crafting and pricing information from crossoutdb.com and reports about the most profitable crafts

## Install
npm & nodejs are required
```
npm install
```

## Update DB
```
npm run start
```

## Get results
```
select sellPrice * 0.9 - craftPrice as margin, (sellPrice * 0.9 - craftPrice) / craftTime as marginPerMin, * from items where craftOrBuy = 'Craft' order by marginPerMin desc
```