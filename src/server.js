import express from 'express'
import { cartRouter} from './cartRouter/cartRouter.js'
import { productsRouter} from './productsRouter/productsRouter.js'
import { viewsRouter } from './viewsRouter/viewsRouter.js'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'

const app = express()
const server = app.listen(8080, () => console.log('Server ready on port 8080'))
console.log(server)
const io = new SocketIOServer(server)


app.use((req, res, next) =>{
    req['io'] = io
    next()
})

app.use(productsRouter)
app.use(cartRouter)
app.use(viewsRouter)
app.use(express.json())
//app.use(express.static('/', ('/views')))
app.use('/viewsRouter', viewsRouter)

app.engine('handlebars', engine())
app.set('views', './src/views')

io.on('connection', socket => {
    console.log('nuevo cliente conectado!')
        
    socket.on('nombre', data => {
        console.log(data)
        socket.broadcast.emit('actualizar', data)
    })
})



