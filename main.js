/**
 * Created by thomas on 03/10/2014.
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': "http://forums.spongepowered.org/"}, function(tab) {});
    chrome.browserAction.setBadgeText({text: ''});
})

var badgetext = 0;
var xhr = new XMLHttpRequest();
var notificationmessages = ['mentioned', 'replied', 'quoted', 'edited', 'liked', 'private_message', 'invited_to_private_message', 'invitee_accepted', 'posted', 'moved_post','linked', 'granted_badge'];
var unreadO = 0;

update();
check();

function check(){
    xhr.open("GET", "http://forums.spongepowered.org/notifications.json" , true)
    xhr.onreadystatechange=function(){
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var unread = 0;
            for (var key in data) {
                if (data[key]['read'] == false){
                    unread += 1;
                }

            }
            console.log('Check result: ' + unread)
            if(unread >= 1 && unread != unreadO){
                setTimeout(function(){ unreadO = 0 }, 60000)
                notify(unread, unread == 1 ? "alert" : "alerts", "http://forums.spongepowered.org/");
                unreadO = unread;
            }
            badgetext = unread;
            update();
        }
    };
    xhr.send();

    setTimeout(check, 10000);
}

function update(){
    chrome.browserAction.setBadgeText({text: '' + badgetext});
}
function notify(number, type, url) {
    var notification = webkitNotifications.createNotification(
        'icon.png',
        'Attention:',
            'You have ' + number + ' unread Sponge ' + type + '!'
    );
    notification.show();
    notification.onclick = function(tabs)  {
        chrome.tabs.create({'url': url});
        chrome.browserAction.setBadgeText({text: ''});
        notification.cancel();
    }
    setTimeout(function() {notification.cancel()}, 20000);
}
