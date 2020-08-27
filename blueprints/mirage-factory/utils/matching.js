// ADRESS FUNCTIONS

function isZip(s){
    return (s.toLowerCase().includes("zip")
    || s.toLowerCase().includes("areacode"))
}

function isCity(s){
    return (s.toLowerCase().includes("city")
        || s.toLowerCase().includes("town")
        || s.toLowerCase().includes("place")
        || s.toLowerCase().includes("burgh"))
}

function isAdress(s){
    return (s.toLowerCase().includes("street")
        || s.toLowerCase().includes("adress"))
}

function isCountry(s){
    return (s.toLowerCase().includes("country")
        || s.toLowerCase().includes("land")
        || s.toLowerCase().includes("nation"))
}

function isState(s){
    return (s.toLowerCase().includes("state"))
}

function isLatitude(s){
    return (s.toLowerCase().includes("latitude"))
}

function isLongitude(s){
    return (s.toLowerCase().includes("longitude"))
}

// COMMERCE FUNCTIONS

function isColor(s){
    return (s.toLowerCase().includes("color"))
}

function isProduct(s){
    return (s.toLowerCase().includes("product"))
}

function isPrice(s){
    return (s.toLowerCase().includes("price")
            || s.toLowerCase().includes("cost"))
}

// DATE FUNCTIONS

function isDateBefore(s){
    return (s.toLowerCase().includes("birthday")
        || s.toLowerCase().includes("dayofbirth")
        || s.toLowerCase().includes("weddingdate")
        || s.toLowerCase().includes("graduationdate"))
}

function isDate(s){
    return (s.toLowerCase().includes("date"))
}

function isMonth(s){
    return (s.toLowerCase().includes("month"))
}

// FINANCE FUNCTIONS

function isIban(s){
    return (s.toLowerCase().includes("iban"))
}

function isBic(s){
    return (s.toLowerCase().includes("bic"))
}

function isBitcoin(s){
    return (s.toLowerCase().includes("bitcoin"))
}

function isAmount(s){
    return (s.toLowerCase().includes("amount")
    || s.toLowerCase().includes("salary")
    || s.toLowerCase().includes("pay")
    || s.toLowerCase().includes("bonus"))
}

// INTERNET FUNCTIONS

function isEmail(s){
    return (s.toLowerCase().includes("mail"))
}

function isUsername(s){
    return (s.toLowerCase().includes("login")
        || s.toLowerCase().includes("username")
        || s.toLowerCase().includes("pseudo"))
}

function isUrl(s){
    return (s.toLowerCase().includes("url")
        || s.toLowerCase().includes("link"))
}

function isPassword(s){
    return (s.toLowerCase().includes("password")
        || s.toLowerCase().includes("pwd"))
}

// LOREM FUNCTIONS

function isTitle(s){
    return (s.toLowerCase().includes("title")
        || s.toLowerCase().includes("head")
        || s.toLowerCase().includes("sentence"))
}

function isText(s){
    return (s.toLowerCase().includes("text")
        || s.toLowerCase().includes("script")
        || s.toLowerCase().includes("article")
        || s.toLowerCase().includes("paper")
        || s.toLowerCase().includes("blog")
        || s.toLowerCase().includes("story")
        || s.toLowerCase().includes("record"))
}

// NAME FUNCTIONS

function isFirstname(s){
    return (s.toLowerCase().includes("firstname")
    || s.toLowerCase().includes("name"))
}

function isLastname(s){
    return (s.toLowerCase().includes("lastname"))
}

function isJob(s){
    return (s.toLowerCase().includes("job")
        || s.toLowerCase().includes("work")
        || s.toLowerCase().includes("employment")
        || s.toLowerCase().includes("business")
        || s.toLowerCase().includes("occupation"))
}

function isPhone(s){
    return (s.toLowerCase().includes("phone")
        || s.toLowerCase().includes("call")
        || s.toLowerCase().includes("contact"))
}

// SYSTEM FUNCTIONS

function isFile(s){
    return (s.toLowerCase().includes("file"))
}

function isVersion(s){
    return (s.toLowerCase().includes("version"))
}

function matchString(s){
    // ADRESS PART.
    if(isZip(s)){
        return 'faker.address.zipCode()'
    }
    if(isCity(s)){
        return 'faker.address.city()'
    }
    if(isAdress(s)){
        return 'faker.address.streetAddress()'
    }
    if(isCountry(s)){
        return 'faker.address.country()'
    }
    if(isState(s)){
        return 'faker.address.state()'
    }
    if(isLatitude(s)){
        return 'faker.address.latitude()'
    }
    if(isLongitude(s)){
        return 'faker.address.longitude()'
    }
    // COMMERCE PART.
    if(isColor(s)){
        return 'faker.commerce.color()'
    }
    if(isProduct(s)){
        return 'faker.commerce.product()'
    }
    if(isPrice(s)){
        return 'faker.commerce.price()'
    }
    // DATE PART.
    if(isDateBefore(s)){
        return 'faker.date.past()'
    }
    if(isDate(s)){
        return 'faker.date.recent()'
    }
    if(isMonth(s)){
        return 'faker.date.month()'
    }
    // FINANCE PART.
    if(isIban(s)){
        return 'faker.finance.iban()'
    }
    if(isBic(s)){
        return 'faker.finance.bic()'
    }
    if(isBitcoin(s)){
        return 'faker.finance.bitcoinAddress()'
    }
    if(isAmount(s)){
        return 'faker.finance.amount()'
    }
    // INTERNET PART.
    if(isEmail(s)){
        return 'faker.internet.email()'
    }
    if(isUsername(s)){
        return 'faker.internet.userName()'
    }
    if(isUrl(s)){
        return 'faker.internet.url()'
    }
    if(isPassword(s)){
        return 'faker.internet.password()'
    }
    // LOREM PART.
    if(isTitle(s)){
        return 'faker.lorem.sentence()'
    }
    if(isText(s)){
        return 'faker.lorem.text()'
    }
    // NAME PART.
    if(isLastname(s)){
        return 'faker.name.lastName()'
    }
    if(isFirstname(s)){
        return 'faker.name.firstName()'
    }
    if(isJob(s)){
        return 'faker.name.jobTitle()'
    }
    // PHONE PART.
    if(isPhone(s)){
        return 'faker.phone.phoneNumber()'
    }
    // SYSTEM PART.
    if(isFile(s)){
        return 'faker.system.fileName()'
    }
    if(isVersion(s)){
        return 'faker.system.semver()'
    }

    return 'faker.lorem.word()'
}

module.exports = {
    matchString: matchString
}

const faker = require('faker');