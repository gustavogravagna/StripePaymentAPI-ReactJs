const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
const { TransformStreamDefaultController } = require('node:stream/web')

const app = express()


const stripe = new Stripe("sk_test_51L5H8jB7nTOqwGMbcuq58Nhf3OPdXwoZ19ivCmNK5kIbcmIv7MHoVNhoLXBgrX5lbtkSQ6k47Xm7bXHCgQXQ8pvS00m1vdKJR4")

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
    try{
        const { id, amount } = req.body


        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Minimalist Light",
            payment_method: id,
            confirm: true
        }); 

        console.log(payment)

        console.log(req.body)
        res.send({message: 'succesfull payment'})
        }catch(error){
            console.log(error)
            res.json({message: error.row.message})
        }
    
})

app.listen(3002, () => {
    console.log('server on port', 3002)
})

