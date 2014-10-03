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

update();
check();

function check(){
    xhr.open("GET", "http://forums.spongepowered.org/notifications.json" , true)
    xhr.onreadystatechange=function(){
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var unread = 0;
            console.log(data);
            for (var key in data) {
                console.log(data[key]);
                if (data[key]['read'] == false){
                    unread += 1;
                    //notify(data[key]);
                }

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

function notify(data){
    var id = "SA" + data['topic_id'] + ':' + data['post_number'] + data['notification_type'];
    console.log(id);

    chrome.notifications.create(id,{
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Althe Frazon',
            message: "Hi, what's going on tonight?",
            buttons: [  { title: 'Call',
                iconUrl: 'icon.png'},
                { title: 'Send Email',
                    iconUrl: 'icon.png'}],
            priority: 0},
        function() { /* Error checking goes here */}

    );
}

