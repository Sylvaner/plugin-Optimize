(function ($)
{
    var toggleHTML = '<div id="toctitle"><h2>%1</h2> <span class="toctoggle">[<a id="toctogglelink" class="internal" href="#">%2</a>]</span></div>';
    var tocContainerHTML = '<div id="toc-container"><table class="toc" id="toc"><tbody><tr><td>%1<ul>%2</ul></td></tr></tbody></table></div>';

    function createLevelHTML(anchorId, tocLevel, tocSection, tocNumber, tocText, tocInner)
    {
        var link = '<a href="#%1"><span class="tocnumber">%2</span> <span class="toctext">%3</span></a>%4'.replace('%1', anchorId).replace('%2', tocNumber).replace('%3', tocText).replace('%4', tocInner ? tocInner : '');
        return '<li class="toclevel-%1 tocsection-%2">%3</li>\n'.replace('%1', tocLevel).replace('%2', tocSection).replace('%3', link);
    }

    function checkMaxHead($root)
    {
        if ($root.find('h1').length > 0) {
            return ['h1', 'h2'];
        } else {
            return ['h2', 'h3'];
        }
    }

    $.fn.toc = function (settings)
    {
        var config = {
            renderIn: 'self',
            anchorPrefix: 'tocAnchor-',
            showAlways: false,
            minItemsToShowToc: 2,
            saveShowStatus: true,
            contentsText: 'Contents',
            hideText: 'hide',
            showText: 'show',
            showCollapsed: false
        };
        if (settings) {
            $.extend(config, settings);
        }
        var tocHTML = '';
        var tocLevel = 1;
        var tocSection = 1;
        var itemNumber = 1;
        var tocContainer = $(this);
        var heads = checkMaxHead(tocContainer);
        var firstHead = heads[0];
        var secondHead = heads[1];
        tocContainer.find(firstHead).each(function ()
        {
            var levelHTML = '';
            var innerSection = 0;
            var h1 = $(this);
            h1.nextUntil(firstHead).filter(secondHead).each(function ()
            {
                ++innerSection;
                var anchorId = config.anchorPrefix + tocLevel + '-' + tocSection + '-' + +innerSection;
                $(this).attr('id', anchorId);
                levelHTML += createLevelHTML(anchorId, tocLevel + 1, tocSection + innerSection, itemNumber + '.' + innerSection, $(this).text());
            });
            if (levelHTML) {
                levelHTML = '<ul>' + levelHTML + '</ul>\n';
            }
            var anchorId = config.anchorPrefix + tocLevel + '-' + tocSection;
            h1.attr('id', anchorId);
            tocHTML += createLevelHTML(anchorId, tocLevel, tocSection, itemNumber, h1.text(), levelHTML);
            tocSection += 1 + innerSection;
            ++itemNumber;
        });
        var tocIndexCount = itemNumber - 1;
        var show = config.showAlways ? true : config.minItemsToShowToc <= tocIndexCount;
        if (config.saveShowStatus && typeof($.cookie) == "undefined") {
            config.saveShowStatus = false;
        }
        if (show && tocHTML) {
            var replacedToggleHTML = toggleHTML.replace('%1', config.contentsText).replace('%2', config.hideText);
            var replacedTocContainer = tocContainerHTML.replace('%1', replacedToggleHTML).replace('%2', tocHTML);
            if (config.renderIn != 'self') {
                $(config.renderIn).html(replacedTocContainer);
            } else {
                tocContainer.prepend(replacedTocContainer);
            }
            $('#toctogglelink').click(function ()
            {
                var ul = $($('#toc ul')[0]);
                if (ul.is(':visible')) {
                    ul.hide();
                    $(this).text(config.showText);
                    if (config.saveShowStatus) {
                        $.cookie('toc-hide', '1', {expires: 365, path: '/'});
                    }
                    $('#toc').addClass('tochidden');
                } else {
                    ul.show();
                    $(this).text(config.hideText);
                    if (config.saveShowStatus) {
                        $.removeCookie('toc-hide', {path: '/'});
                    }
                    $('#toc').removeClass('tochidden');
                }
                return false;
            });
            if (config.saveShowStatus && $.cookie('toc-hide')) {
                var ul = $($('#toc ul')[0]);
                ul.hide();
                $('#toctogglelink').text(config.showText);
                $('#toc').addClass('tochidden');
            }
            if (config.showCollapsed) {
                $('#toctogglelink').click();
            }
        }
        return this;
    }
})(jQuery);
