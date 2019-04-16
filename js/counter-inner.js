// Initialize Firebase
var config = {
    apiKey: "AIzaSyBGen0wdUWhmnJhgjmiZO7mgtYh4KXoSW0",
    authDomain: "counter-nuotsu.firebaseapp.com",
    databaseURL: "https://counter-nuotsu.firebaseio.com",
    projectId: "counter-nuotsu",
    storageBucket: "",
    messagingSenderId: "201715627930"
};
firebase.initializeApp(config);
function updateFirebase() {
    user = $('#user').val()
    name = $('#name').val()
    if (user != '' && name != '') {
        delete theCount.user
        delete theCount.name
        firebase.database().ref(`${user}/${name}`).set(theCount)
    }
}
function loadFirebase() {
    user = $('#user').val()
    name = $('#name').val()
    if (user != '' && name != '') {
        $('#loading').fadeIn()
        firebase.database().ref(`${user}/${name}`).on('value', (snapshot) => {
            c_firebase = snapshot.val()
            if (c_firebase != null) {
                $('#count').val(c_firebase.count)
                $('#increment').val(c_firebase.increment)
                $('#timestamp').attr({
                    'ts': c_firebase.timestamp,
                    'tD': c_firebase.timeData
                })
                $('.counter-inner')
                    .attr('bg', c_firebase.bg)
                    .css(
                        'background-image', `url('${c_firebase.bg}')`
                    )
                writeTimestamp($('#timestamp'))
            } else {
                $('#count').val(0)
                $('#increment').val(1)
                $('#timestamp').attr({
                    'ts': '',
                    'tD': ''
                })
                $('.counter-inner').css(
                    'background-image', 'none'
                )
                writeTimestamp($('#timestamp'))
            }
        })
        $('#loading').fadeOut()
    }
}; setTimeout(loadFirebase, 100)
$('#user, #name').change(loadFirebase)

// Loading...
$(document)
    .ajaxStart(() => { $('#loading').fadeIn() })
    .ajaxStop(() => { $('#loading').fadeOut() })

// Store Count Info
function storeTheCount() {
    theCount = {
        user: $('#user').val() == '' ? '' : $('#user').val(),
        name: $('#name').val() == '' ? '' : $('#name').val(),
        count: parseInt($('#count').val()),
        increment: parseInt($('#increment').val()),
        bg: $('.counter-inner').attr('bg') == undefined ? 'none' : $('.counter-inner').attr('bg'),
        timestamp: timestamp().split('|')[0],
        timeData: parseInt(timestamp().split('|')[1])
    }
    sessionStorage.setItem(window.frameElement.id, JSON.stringify(theCount))
}
$('input').change(storeTheCount)

// Minus / Plus / Count
function updateTimestamp() {
    $('#timestamp').attr({
        'ts': timestamp().split('|')[0],
        'tD': timestamp().split('|')[1]
    })
    writeTimestamp($('#timestamp'))
}
$('#minus').click(() => {
    $('#count').val($('#count').val() - $('#increment').val())
    storeTheCount()
    updateTimestamp()
    setCounterHeight()
    updateFirebase()
})
$('#plus').click(() => {
    $('#count').val($('#count').val()*1 + $('#increment').val()*1)
    storeTheCount()
    updateTimestamp()
    setCounterHeight()
    updateFirebase()
})
$('#count').blur(() => {
    if ($('#count').val() == '') $('#count').val(0)
    else $('#count').val(parseInt($('#count').val()))
})

// Add BG
$('#addBG').click(() => { $('#addBG_file').click() })
$('#addBG_file').change(() => {
    formData = new FormData()
    formData.append('image', $('#addBG_file')[0].files[0])

    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'POST',
        dataType: 'json',
        headers: {
            "Authorization": "Client-ID 1f37facd924fbb3"
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
            newBG = response.data.link
            $('.counter-inner')
                .attr('bg', newBG)
                .css('background-image', `url('${newBG}')`)
            storeTheCount()
            updateFirebase()
        }
    })
})

// Edit Mode
function setCounterHeight() {
    window.frameElement.setAttribute('c-height', $('.counter-inner').height())
}; setCounterHeight()
$('#edit').click(() => {
    $('#edit span, input, #user-handle, .section-3, .section-4').toggleClass('editing')
    setCounterHeight()
    updateHeader()
})

// Button Pressing (borad)
$('#minus')
    .on('mousedown touchstart', () => {
        $('.section-2 .center, .divider').addClass('minus-pressing')
    })
    .mouseup(() => {
        $('.section-2 .center, .divider').removeClass('minus-pressing')
    })
$('#plus')
    .on('mousedown touchstart', () => {
        $('.section-2 .center, .divider').addClass('plus-pressing')
    })
    .mouseup(() => {
        $('.section-2 .center, .divider').removeClass('plus-pressing')
    })
$('*').on('mouseup touchend', () => {
    $('.section-2 .center, .divider')
        .removeClass('minus-pressing')
        .removeClass('plus-pressing')
})
// #increment:focus
$('#increment')
    .focus(() => {
        $('.section-2 .center').addClass('focused')
    })
    .blur(() => {
        $('.section-2 .center').removeClass('focused')
        if ($('#increment').val() == '') $('#increment').val(1)
    })
