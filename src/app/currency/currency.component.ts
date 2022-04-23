import {Component, OnInit} from '@angular/core'

interface Symbol{
    symbol: string
    name: string
}

interface Rates{
    symbol: string
    rate: number
}
interface Field{
    id: number
    selectedSymbol: string
    inputFieldVal: number
    multyply: number
}

@Component({
    selector:'app-currency',
    templateUrl:'./currency.component.html',
    styleUrls:['./currency.component.css']
})

export class CurrencyComponent implements OnInit{

    mainSymbol = 'UAH'
    myTitle = 'Exchanger'

    currencySymbols: Symbol[] = [
        {symbol: 'EUR',name: 'Euro'},
        {symbol: 'USD',name: 'United States Dollar'},
        {symbol: 'PLN',name: 'Polish Zloty'},
        {symbol: 'RUB',name: 'Russian Ruble'},
        {symbol: 'UAH',name: 'Ukrainian Hryvnia'}
    ]
    fields: Field[] = [
        {id: 1 ,selectedSymbol:this.currencySymbols[0].symbol,inputFieldVal:1,multyply:1},
        {id: 2 ,selectedSymbol:this.currencySymbols[0].symbol,inputFieldVal:1,multyply:1}
    ]

    exchangeRates: Rates[] = []

    findRate(symbol:string){
        let exit = 1
        this.exchangeRates.forEach(idx =>{
            
            if (symbol === idx.symbol){
                exit = idx.rate
                return
            }
        })
        return exit
    }

    changeVal(id:number, event:any){
        console.log('Change in input: '+id)
        this.fields[id-1].inputFieldVal = event.target.value
        switch (id) {
            case 1:
                this.valueUpdateTriger('select')
                this.fields[1].inputFieldVal = Math.round((event.target.value / 
                (this.fields[1].multyply/this.fields[0].multyply))*1000)/1000
                break
            case 2:
                this.valueUpdateTriger('select')
                this.fields[0].inputFieldVal = Math.round((event.target.value / 
                (this.fields[0].multyply/this.fields[1].multyply))*1000)/1000
                break
            default:
                break
        }
    }

    changeSlected(id:number, event:any){
        console.log('Change in select: '+id)
        this.valueUpdateTriger('input')
        this.fields[id-1].multyply = this.findRate(event.target.value)
        this.fields[id-1].selectedSymbol = event.target.value
    }
    

    valueUpdateTriger(type: string){
        switch(type){
            case 'select':
                this.fields[0].multyply = this.findRate(this.fields[0].selectedSymbol)
                this.fields[1].multyply = this.findRate(this.fields[1].selectedSymbol)
                break
            case 'input':
                this.fields[0].inputFieldVal = 0
                this.fields[1].inputFieldVal = 0
                break
        }
        

    }

    ngOnInit(): void {
        let count = 0
        let titleVal = `${this.myTitle} ${this.mainSymbol} `

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com',
                'X-RapidAPI-Key': '3f0f434759msha9cc5e156adbeccp110964jsn1595a037ac53'
            }
        };
        
        fetch(`https://exchangerate-api.p.rapidapi.com/rapid/latest/${this.mainSymbol}`, options)
            .then(response => response.json())
            .then(response => {
                
                while(count !== this.currencySymbols.length - 1){
                    
                    Object.keys(response.rates).forEach(key => {
                        
                        if (key === this.currencySymbols[count].symbol){

                            this.exchangeRates.push({
                                symbol:this.currencySymbols[count].symbol, 
                                rate:Math.round(1/response.rates[key] * 1000)/1000
                            })
                            
                            count++
                            
                            if (key !== this.mainSymbol) {
                                titleVal += `| ${key}: ${Math.round(1/response.rates[key] * 1000)/1000} `
                            }
                        }
                    })
                }
                document.title = titleVal
            })
            .catch(err => console.error(err))
    }
}