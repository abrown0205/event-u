
function checkForNull(title, startTime, endTime, category, address, description, capacity) {
    if(title === null || title.length === 0) {
        return false;
    }
    else if(category === null || category.length === 0) {
        return false;
    }
    else if(address === null|| address.length === 0) {
        return false;
    }
    else if(startTime === null|| startTime.length === 0) {
        return false;
    }
    else if(endTime === null|| endTime.length === 0) {
        return false;
    }
    else if(description === null|| description.length === 0) {
        return false;
    }
    else if(capacity === null) {
        return false;
    }

    return true;
}

module.exports = checkForNull;
