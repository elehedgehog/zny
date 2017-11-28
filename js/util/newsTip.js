let intervalHolder = null
const playFn = () => {
  let html = '<div class="same">' + $('.cloudPopup .wrapper').html() + '</div>'
  $('.cloudPopup .wrapper').append(html)
  let len = $('.cloudPopup .wrapper>p').length
  let num = 1
  intervalHolder = setInterval(() => {
    let top = -1 * 26 * num
    $('.cloudPopup .wrapper').stop().animate({marginTop: top + 'px'}, 1500, () => {
      if (num === len) {
        num = 1
        $('.cloudPopup .wrapper').css({marginTop: 0})
      } else
        num++
    })
  }, 3000)
}

const clearInt = () => {
  if (!intervalHolder) return
  clearInterval(intervalHolder)
  intervalHolder = null
  $('.cloudPopup .wrapper .same').remove()
  $('.cloudPopup .wrapper').stop().css({marginTop: 0})
}

const clickFn = () => {
  if ($('.cloudPopup .wrapper>p').length < 2) return
  $('.cloudPopup .wrapper').toggleClass('on')
  if ($('.cloudPopup .wrapper').hasClass('on')) {
    clearInt()
    $('.cloudPopup').css({height: $('.cloudPopup .wrapper>p').length * 26 + 'px'})
  } else {
    $('.cloudPopup').css({height: '26px'})
    playFn()
  }
}

// export const addNewsTip = (key, text) => {
//   clearInt()
//   $('.cloudPopup').css({height: '26px'})
//   $('.cloudPopup .wrapper').removeClass('on')
  
//   $('.cloudPopup .wrapper>p').off('click')
//   $('.cloudPopup .wrapper').append(`<p class="tip-${key}">${text}</p>`)
//   setTimeout(function() {
//     $('.cloudPopup .wrapper>p').click(clickFn)
//   }, 0);
//   $('.cloudPopup').show()
//   if ($('.cloudPopup .wrapper>p').length >= 2) playFn()
// }

// export const removeNewsTip = (key) => {
//   clearInt()
//   $('.cloudPopup').css({height: '26px'})
//   $('.cloudPopup .wrapper').removeClass('on')
  
//   $(`.cloudPopup .wrapper .tip-${key}`).remove()
//   if ($('.cloudPopup .wrapper>p').length >= 2) playFn()
//   if(!$('.cloudPopup .wrapper>p').length) $('.cloudPopup').hide()
// }
export const addNewsTip = (key, text) => {
  $('.cloudPopup .wrapper').append(`<p class="tip-${key}">${text}</p>`)
  $('.cloudPopup').show()
}

export const removeNewsTip = (key) => {
  $(`.cloudPopup .wrapper .tip-${key}`).remove()
  if(!$('.cloudPopup .wrapper>p').length) $('.cloudPopup').hide()
}
