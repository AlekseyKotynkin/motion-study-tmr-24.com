!function(n){var e,t,a,i,o,c;o=n(".main-navigation"),c=n("<button />",{class:"dropdown-toggle","aria-expanded":!1}).append(boost_biz_l10n.icon).append(n("<span />",{class:"screen-reader-text",text:boost_biz_l10n.expand})),o.find(".menu-item-has-children > a, .page_item_has_children > a").after(c),o.find(".current-menu-ancestor > button").addClass("toggled-on").attr("aria-expanded","true").find(".screen-reader-text").text(boost_biz_l10n.collapse),o.find(".current-menu-ancestor > .sub-menu").addClass("toggled-on"),o.find(".dropdown-toggle").click(function(e){var t=n(this),a=t.find(".screen-reader-text");e.preventDefault(),t.toggleClass("toggled-on"),t.next(".children, .sub-menu").toggleClass("toggled-on"),t.attr("aria-expanded","false"===t.attr("aria-expanded")?"true":"false"),a.text(a.text()===boost_biz_l10n.expand?boost_biz_l10n.collapse:boost_biz_l10n.expand)}),e=n("#masthead"),t=e.find(".menu-toggle"),a=e.find(".main-navigation"),i=e.find(".main-navigation > div > ul"),t.length&&(t.attr("aria-expanded","false"),t.on("click.boost_biz",function(){a.toggleClass("toggled-on"),n(this).attr("aria-expanded",a.hasClass("toggled-on"))})),function(){function e(){"none"===n(".menu-toggle").css("display")?(n(document.body).on("touchstart.boost_biz",function(e){n(e.target).closest(".main-navigation li").length||n(".main-navigation li").removeClass("focus")}),i.find(".menu-item-has-children > a, .page_item_has_children > a").on("touchstart.boost_biz",function(e){var t=n(this).parent("li");t.hasClass("focus")||(e.preventDefault(),t.toggleClass("focus"),t.siblings(".focus").removeClass("focus"))})):i.find(".menu-item-has-children > a, .page_item_has_children > a").unbind("touchstart.boost_biz")}i.length&&i.children().length&&("ontouchstart"in window&&(n(window).on("resize.boost_biz",e),e()),i.find("a").on("focus.boost_biz blur.boost_biz",function(){n(this).parents(".menu-item, .page_item").toggleClass("focus")}))}()}(jQuery);