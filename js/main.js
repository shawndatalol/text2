// Append Counters
function genUID() {
    var uid = ''
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (i = 0; i < 10; i++)
        uid += char.charAt(Math.floor(Math.random() * char.length))
    return uid
}
if (sessionStorage.length > 0)
    for (i = 0; i < sessionStorage.length; i++) {
        $('#counters').append(`
            <iframe id="${Object.keys(sessionStorage)[i]}" class="counter" src="counter.html"></iframe>
        `)
    }
else
    $('#counters').html(`
        <iframe id="${genUID()}" class="counter" src="counter.html"></iframe>
    `)

// Load Count Info
$('.counter').map(function() {
    $(this).on('load', () => {
        if (sessionStorage.length != 0) {
            c_info = JSON.parse(sessionStorage.getItem($(this).attr('id')))
            $(this).contents()
                .find('#user').val(c_info.user).end()
                .find('#name').val(c_info.name).end()
                .find('#count').val(c_info.count).end()
                .find('#increment').val(c_info.increment).end()
                .find('#timestamp').attr({
                    'ts': c_info.timestamp,
                    'tD': c_info.timeData
                }).end()
                .find('.counter-inner')
                    .attr('bg', c_info.bg)
                    .css(
                        'background-image', `url('${c_info.bg}')`
                    )
            writeTimestamp($(this).contents().find('#timestamp'))
        }
    })
})

// Adjust Counter Height
function adjustCounterHeight() {
    $('.counter').map(function() {
        $(this).on('load', () => {
            $(this).css({
                'height': $(this).attr('c-height'),
                'min-height': $(this).attr('c-height')
            })
        })
    })
}; adjustCounterHeight()
$(window).resize(adjustCounterHeight)
$('#edit, #minus, #plus').click(() => {
    setTimeout(() => {
        window.frameElement.style.minHeight =
            `${window.frameElement.getAttribute('c-height')}px`
    })
})

// Load Timestamp
function timestamp() {
    now = new Date()
        y = now.getFullYear()
        m = now.getMonth()+1;      if (m < 10) m = `0${m}`
        d = now.getDate();         if (d < 10) d = `0${d}`
        hr = now.getHours();       if (hr < 10) hr = `0${hr}`
        min = now.getMinutes();    if (min < 10) min = `0${min}`
        sec = now.getSeconds();    if (sec < 10) sec = `0${sec}`
        mon = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        day = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'
        ]
        geo = now.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
    return `${y}/${m}/${d} - ${hr}:${min}:${sec} (${geo})|${now.getTime()}`
}
function writeTimestamp(ts) {
    underOneMinute = setInterval(writeTimestamp_inner, 1000)
    function writeTimestamp_inner() {
        if ((timestamp().split('|')[1] - ts.attr('tD')) / 1000 <= 60)
            ts.html(
                `${Math.floor((timestamp().split('|')[1] - ts.attr('tD')) / 1000)} sec ago`
            )
        else {
            ts.html(ts.attr('ts'))
            clearInterval(underOneMinute)
        }
    }; writeTimestamp_inner()
}

// Nav
$('#openHeader').click(() => {
    $('header, #openHeader, #counters, nav').toggleClass('opened')
    $('header nav').slideToggle(200)
    updateHeader()
})
function navMaxHeight() {
    $('#counters').css('padding-top', $('header h1').height() + 20)
    $('header nav').css('max-height', $(window).height() - $('header h1').height() - 10)
}; navMaxHeight()
$(window).resize(navMaxHeight)

// Add / Delete Counters
function updateHeader() {
    $('header nav .c-previews table').html('')
    $('.counter').map(function() {
        c_info = JSON.parse(sessionStorage.getItem($(this).attr('id')))
            if (c_info == undefined) c_info = { user: '', name: '', count: 0, increment: 1}
        $('header nav .c-previews table').append(`
            <tr c-id="${$(this).attr('id')}">
                <td>
                    <span id="c-prev-user-handle">@</span>
                    <input id="c-prev-user" disabled
                        type="text" value="${c_info.user}" placeholder="User">
                </td>
                <td><input id="c-prev-name" disabled
                    type="text" value="${c_info.name}" placeholder="Counter"></td>
                <td><input id="c-prev-count" disabled
                    type="number" value="${c_info.count}" placeholder="0"></td>
                <td><button class="deleteCounter"></button></td>
            </tr>
        `)
    })
    deleteCounter()
}; updateHeader()
$('#addCounter').click(() => {
    $('#counters').append(`
        <iframe id="${genUID()}" class="counter" src="counter.html"></iframe>
    `)
    updateHeader()
    adjustCounterHeight()
})
function deleteCounter() {
    $('.deleteCounter').map(function() {
        $(this).click(() => {
            user = `@${$(this).parent().parent().find('#c-prev-user').val()}\n`
                if ($(this).parent().parent().find('#c-prev-user').val() == '') user = ``
            name = `${$(this).parent().parent().find('#c-prev-name').val()}\n`
                if ($(this).parent().parent().find('#c-prev-name').val() == '') name = ``
            count= `Counter: ${$(this).parent().parent().find('#c-prev-count').val()}`
                if ($(this).parent().parent().find('#c-prev-count').val() == '') count = ``
            if (confirm(
                    `Are you sure you want to delete this Counter?\n\n` +
                    `${user}${name}${count}`
                )) {
                    $(this).parent().parent()
                        .fadeOut(1000, function() { $(this).remove() })
                    $(`#${$(this).parent().parent().attr('c-id')}`)
                        .fadeOut(1000, function() { $(this).remove() })
                    sessionStorage.removeItem($(this).parent().parent().attr('c-id'))
                }
        })
    })
}
