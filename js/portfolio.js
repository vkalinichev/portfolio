$(function(WRUMLY) {
    WRUMLY = {
        sections: {},
        tags: []
    };

    var addDataTag = function (tag, block_name) {
        var $tag = $(tag),
            tag_text = $tag.text();

        WRUMLY.tags.push(tag_text);
        if (block_name !== undefined) WRUMLY.sections[block_name].push(tag_text);
        $tag.attr('data-tag', tag_text);
    };

    WRUMLY.init = function() {
        var $header_tags = $('.header').find('.js-tag'),
            $all_blocks = $('.preview-item');


        FastClick.attach(document.body, {});

        $header_tags.each(function() { addDataTag(this); });

        $all_blocks.each(function () {
            var $block = $(this),
                block_name = this.id,
                $tags = $block.find('.js-tag');

            WRUMLY.sections[block_name] = [];
            $tags.each(function() { addDataTag(this, block_name); });
        });
    };

    $(document)
        .on('click', '.scroll_link', function (e) {
            var $target = $($(this).attr('href')),
                scrollTop = $target.offset().top;

            $target.removeClass('preview-item_hidden');

            $('html,body').animate({ scrollTop: scrollTop }, 200);
            setTimeout(function () { $target.addClass('preview-item_flashed') }, 100);
            setTimeout(function () { $target.removeClass('preview-item_flashed') }, 300);

            e.preventDefault();
        })
        .on('click', '.js-tag', function () {
            var selected_tag = $(this).attr('data-tag'),
                selected_tag_selector = '[data-tag="%tag%"]'.replace('%tag%', selected_tag),
                is_first_filtered_block = true;

            history.pushState(null, null, selected_tag);

            if (WRUMLY.selected_tag === selected_tag) {
                $('.js-reset-filter').click();
            } else {
                WRUMLY.selected_tag = selected_tag;
                $('.tag_filtered').removeClass('tag_filtered');
                $(selected_tag_selector).addClass('tag_filtered').closest('.preview-item');

                $('.preview-item').each(function() {
                    var $block = $(this),
                        block_name = this.id,
                        show_block = $.inArray(selected_tag, WRUMLY.sections[block_name]) > -1;

                    $block
                        .toggleClass('preview-item_hidden', !show_block)
                        .toggleClass('preview-item_first', show_block && is_first_filtered_block);

                    if (show_block) is_first_filtered_block = false;

                });
            }
        })
        .on('click', '.js-reset-filter', function () {
            history.pushState(null, null, "/");
            $('.preview-item_hidden').removeClass('preview-item_hidden');
            $('.preview-item_first').removeClass('preview-item_first');
            $('.tag_filtered').removeClass('tag_filtered');
            $('.tag_button-reset').addClass('tag_filtered');

            delete WRUMLY.selected_tag;
        });

    WRUMLY.init();

}(window.WRUMLY = window.WRUMLY || {}));