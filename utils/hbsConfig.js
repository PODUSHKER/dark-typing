const expressHbs = require('express-handlebars')

const hbsConfig = expressHbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'base',
    extname: 'hbs',
    
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    },

    helpers: {
        getTime(datetime){
            return datetime.toTimeString().slice(0, 5)
        },
        numberIncrement(number){
            return Number(number)+1
        },
        getTopResults(results){
            return results.length > 10 ? results.slice(0, 10) : results
        },
        not(obj){
            return !obj;
        },
        showDate(date){
            const today = new Date().getDate()
            if (date.getDate() === today){
                return 'Сегодня'
            }
            if (date.getDate() === today-1){
                return 'Вчера'
            }
            return date.toDateString()
        }
    }
})


module.exports = hbsConfig