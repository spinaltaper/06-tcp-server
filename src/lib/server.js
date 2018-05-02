'use strict'

const net=require('net');
const logger=require('./logger');
const faker=require('faker');
//
const app=net.createServer();
let clients=[];
//
const parseCommand=(message,socket)=>{
    if(!message.startsWith('@')){
        return false;
    }
const parsedMessage=message.split(' ');
const command=parsedMessage[0];
logger.log(logger.INFO,`Parsing a command ${command}`);
}
//
switch(command){
        case '@list':{
            const clientNames=clients.map(client=>client.name).join('\n');
            socket.write(`${clientNames}\n`);
            break;
        }
        default:
        socket.write('INVALID COMMAND');
        break;
return true;
};

const removeClient = socket => () => {
    clients=clients.filter(client => client !== socket);
    logger.log(logger.INFO,`Removing ${socket.name}`)
};

app.on('connection',(socket) => {
    logger.log(logger.INFO,'new socket');
    clients.push(socket);
    socket.write('Welcome!\n');
    socket.name=faker.internet.userName();
    socket.write(`Your name this session is ${socket.name}\n`);
    //Events from the socket
    socket.on('data',(data)=>{
        const message=data.toString().trim();
        logger.log(logger.INFO,`Processing message: ${message} from ${socket.name}`);
        if(parseCommand(message,socket)){
            return;
        }
        //Send the message to each client other than the one who posted.
        clients.forEach((client) => {
            if(client!==socket){
                client.write(`${socket.name}`)
            }
        });
        });
        socket.on('close',removeClient(socket));
        socket.on('error',()=>{
            logger.log(logger.ERROR,socket.name);
            removeClient(socket)();
    });
})

const server = module.exports={};

server.start=()=>{
    if(!process.env.PORT){
        logger.log(logger.ERROR,'No PORT provided!');
        throw new Error('No error provided!');
    }
    logger.log(logger.INFO, `Server is up on PORT ${process.env.PORT}`);
    return app.listen({port:process.env.PORT},()=>{});
};
server.stop=()=>{
    logger.log(logger.INFO,'Server is offline');
    return app.close(()=>{});
}
