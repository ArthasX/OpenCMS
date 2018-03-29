// module.exports = {
//     appenders:{ [
//         {
//             type: 'console'
//         },
//         {
//             type: 'dateFile',
//             category: 'access',
//             filename: 'logs/access/access',
//             pattern: '-dd--hh.log',
//             alwaysIncludePattern: true
//         },
//         {
//             type: 'dateFile',
//             category: 'system',
//             filename: 'logs/system/system',
//             pattern: '-dd.log',
//             alwaysIncludePattern: true
//         },
//         {
//             type: 'dateFile',
//             category: 'database',
//             filename: 'logs/database/database',
//             pattern: '-dd.log',
//             alwaysIncludePattern: true
//         },
//         {
//             type: 'logLevelFilter',
//             level: 'ERROR',
//             appender: {
//                 type: 'dateFile',
//                 filename: 'logs/errors/error',
//                 pattern: '-MM-dd.log',
//                 alwaysIncludePattern: true
//             }
//         }
//     ] },
//     replaceConsole: true
// };

module.exports = {
    appenders: {
        out: {
            type: 'console'
        },
        access: {
            type: 'dateFile',
            filename: 'logs/access/access',
            pattern: '-dd--hh.log',
            alwaysIncludePattern: true
        },
        system: {
            type: 'dateFile',
            filename: 'logs/system/system',
            pattern: '-dd.log',
            alwaysIncludePattern: true
        },
        database: {
            type: 'dateFile',
            filename: 'logs/database/database',
            pattern: '-dd.log',
            alwaysIncludePattern: true
        },
        error: {
            // type: 'logLevelFilter',
            type: 'dateFile',
            filename: 'logs/errors/error',
            pattern: '-MM-dd.log',
            alwaysIncludePattern: true
        },
        // replaceConsole: true
    }, categories: {
        default: {appenders: ['out'], level: 'info'},
        access: {appenders: ['out'], level: 'info'},
        system: {appenders: ['out'], level: 'info'},
        error: {appenders: ['out'], level: 'error'},

    }
};