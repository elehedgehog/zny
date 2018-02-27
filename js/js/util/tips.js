export const getNoDataTips = (className) => {
    $(className).fadeIn(1000, function() {
        setTimeout(function() {
          $(className).fadeOut();
        }, 1000);
    });
}