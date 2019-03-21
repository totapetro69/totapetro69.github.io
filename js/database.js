var dbPromise = idb.open('AplikasiBolabola', 1, upgradeDb => {
        var favoriteStore = upgradeDb.createObjectStore('favoriteClub', {
            keyPath: 'id'
        });
favoriteStore.createIndex('clubName', 'clubName', { unique: false});
});

function addToFavorite(data) {
    dbPromise.then(function(dbs) {
        var trx = dbs.transaction('favoriteClub', 'readwrite');
        var objstore = trx.objectStore('favoriteClub');
        var dataStore = {
            id: data.id,
            name: data.name,
            crestUrl : data.crestUrl,
        };

        trx.objectStore('favoriteClub').put(dataStore);
        return trx.complete;
    }).then(function() {
        console.log('This team success added from My Favorit.');
        var message = `${data.name} added to my favorit`;

        if (Notification.permission === 'granted') {
            viewNotification(message);
        } else {
            console.error('Fitur notifikasi tidak diijinkan.');
        }

    }).catch(function(err) {
        console.log(err);
    });
}

function deleteFromFavorite(data) {
    dbPromise.then(function(dbs) {
        var trx = dbs.transaction('favoriteClub', 'readwrite');
        var objstore = trx.objectStore('favoriteClub');

        objstore.delete(data);
        return trx.complete;
    }).then(function() {
        console.log('This team success removed from My Favorit.');
        var message = `Team success removed from My Favorit`;

        if (Notification.permission === 'granted') {
            viewNotification(message);
        } else {
            console.error('Fitur notifikasi tidak diijinkan.');
        }
    }).catch(function(err) {
        console.log(err);
    });
}

function getFavoriteData() {
    return new Promise(function (resolve, reject) {
        dbPromise
            .then(function (dbs) {
                var trx = dbs.transaction('favoriteClub', "readonly");
                var objstore = trx.objectStore('favoriteClub');
                return objstore.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function checkFavoriteData(id) {
    return new Promise(function (resolve, reject) {
        dbPromise.then(function (dbs) {
            var trx = dbs.transaction('favoriteClub', "readonly");
            var objstore = trx.objectStore('favoriteClub');
            return objstore.get(id);
        })
            .then(function (data) {
                if (data != undefined) {
                    resolve(true)
                } else {
                    reject(false);
                }
            });
    });
}

function viewNotification(body) {
    const title = 'My Favorite';
    const options = {
        'body': `${body}`,
        'icon': '../icon.png',
        'badge': '../icon.png'
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}