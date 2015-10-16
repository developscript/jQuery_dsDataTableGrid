/*!
 *
 * DevelopScript - DataTableGrid v0.7.0 (http://developscript.com)
 *
 * Licensed under the MIT license.
 *
 * @file    dsDataTableGrid.js
 * @author  Rafael Pegorari
 * @date    15/10/2015
 *
 * ====== Required ======
 * This code was developed based on jQuery v2.1.4.
 * More informations
 * jQuery url: https://jquery.com/
 *
 * ====== Globais ======
 * $, jQuery, _dsSettings_default, getParam, updateParam, _mergeSettings, _dsPaginationGet, _dsSerchGet, _dsRecordsGet, _dsOrderGet,
 * _dsAjax, _dsPagination, _dsSearch, _dsRecordPages, _dsOrder, _dsLabelTotal, _trigger_dsAjax, _dsDataTableGrid
 */

(function ($) {
    /**
     * @desc Config default
     * @private
     */
    var _dsSettings_default = {
            labelTotal: {
                active: true,
                showing: 'Showing',
                to: 'to',
                of: 'of',
                entries: 'entries',
                loading: 'Loading...',
                filter: 'Filter',
                values_in_total: 'values ​​in total',
                records_not_found: 'Records not found.'
            },
            search: {
                active: true,
                autosearch: true
            },
            urlParam: {
                active: true
            },
            recordsPage: {
                active: true
            },
            pagination: {
                active: true
            },
            order: {
                active: true
            },
            _dsEmtName: {
                records: '_dsRecords',
                pagination: '_dsPagination',
                search: '_dsSearch',
                totais: '_dsTotais',
                order: '_dsOrder',
                urlPg: 'pg',
                urlSc: 'search',
                urlRd: 'records',
                urlOr: 'order'

            }
        },

        /**
         * @desc Get the url parameter
         * @param param
         * @returns {string}
         */
        getParam = function (param) {
            var url = window.location.search.substring(1),
                params = url.split("&"),
                val = '';
            $.each(params, function (i, v) {
                var pair = v.split("=");
                if (pair[0] == param) {
                    val = pair[1];
                }
            });
            return decodeURI(val);
        },

        /***
         * @desc Updates of URL parameters
         * @param data
         * @param data.param
         * @param data.value
         * @param data.update
         * @param data._dsSettings
         * @param data.redirect
         * @returns {*}
         */
        updateParam = function (data) {
            if (data._dsSettings.urlParam.active != true) {
                return 'javascript:;'
            }
            var getUrl = document.location.search.substr(1).split('&'),
                url = document.location.href.split('?');
            data.value = encodeURI(data.value);
            if (getUrl[0] != '') {
                var flag_update = false
                $.each(getUrl, function (i, v) {
                    var k = v.split('=');
                    if (k[0] == data.param) {
                        flag_update = true;
                        k[1] = data.value;
                        getUrl[i] = k.join('=');
                    }
                });
                if (flag_update == false) {
                    getUrl[getUrl.length] = [data.param, data.value].join('=');
                }
            } else {
                getUrl[0] = [data.param, data.value].join('=');
            }
            if (data.update == true) {
                window.history.pushState(null, null, url[0] + '?' + getUrl.join('&'));
                if (data.redirect) {
                    _dsAjax(data._dsSettings);
                }
            } else {
                return url[0] + '?' + getUrl.join('&');
            }
        },

        /**
         * @desc Updates the default setting
         * @param options
         * @private
         */
        _mergeSettings = function (options) {
            return $.extend(true, {}, _dsSettings_default, options);
        },

        /**
         * @desc Returns the current page
         * @param _dsSettings
         * @returns {string}
         * @private
         */
        _dsPaginationGet = function (_dsSettings) {
            var val = '',
                elm;
            if (_dsSettings.pagination.active == true) {
                elm = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.pagination + "']");
                if (_dsSettings.urlParam.active == true) {
                    val = getParam(_dsSettings._dsEmtName.urlPg);
                }
                if (elm.length && val == '') {
                    val = elm.find('.active').find('a').data("page");
                }
                val = Number((isNaN(val)) ? 1 : val);
            }
            return val;
        },

        /**
         * @desc Returns values of the research
         * @param _dsSettings
         * @returns {*}
         * @private
         */
        _dsSerchGet = function (_dsSettings) {
            var val,
                elm;
            if (_dsSettings.search.active == true) {
                elm = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']");
                if (_dsSettings.urlParam.active) {
                    val = getParam(_dsSettings._dsEmtName.urlSc);
                } else if (elm.length) {
                    val = elm.val();
                }
            }
            return val;
        },

        /**
         * @desc Returns the number of records per page
         * @param _dsSettings
         * @returns {string}
         * @private
         */
        _dsRecordsGet = function (_dsSettings) {
            var val = '',
                elm;
            if (_dsSettings.recordsPage.active == true) {
                elm = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']");
                if (_dsSettings.urlParam.active) {
                    val = getParam(_dsSettings._dsEmtName.urlRd);
                }
                if (elm.length && val == '') {
                    val = elm.val();
                }
            }
            return val;
        },

        /**
         * @desc Returns ordination
         * @param _dsSettings
         * @returns {string}
         * @private
         */
        _dsOrderGet = function (_dsSettings) {
            var val = '',
                elm;
            if (_dsSettings.order.active == true) {
                elm = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']");
                if (_dsSettings.urlParam.active == true) {
                    val = getParam(_dsSettings._dsEmtName.urlOr);
                }
                if (elm.length && val == '') {
                    val = elm.val();
                }
            }
            return val;
        },

        /**
         * @desc Responsible for carrying out requests in AJAX
         * @param _dsSettings
         * @private
         */
        _dsAjax = function (_dsSettings) {
            var op = _dsSettings,
                dataAjax = {
                    dsRecordPages: _dsRecordsGet(_dsSettings),
                    dsPageNow: _dsPaginationGet(_dsSettings),
                    dsSearch: _dsSerchGet(_dsSettings),
                    dsOrder: _dsOrderGet(_dsSettings)
                },
                data = dataAjax;
            if (typeof op.ajax.addData !== 'undefined') {
                data = $.extend({}, dataAjax, op.ajax.addData);
            }
            jQuery.ajax({
                type: op.ajax.type,
                url: op.ajax.url,
                data: data,
                cache: false,
                dataType: "json",
                beforeSend: function () {
                    _dsLabelTotal(_dsSettings, 1);
                },
                success: function (data) {
                    if (typeof data.fields !== 'undefined') {

                        _dsSettings.constructor.found(data.fields);

                        _dsPagination(_dsSettings, {total: Number(data.pages)});
                        _dsLabelTotal(_dsSettings, 2, {
                            start: data.start,
                            end: data.end,
                            rows: data.rows,
                            total_rows: data.total_rows
                        });
                    } else {
                        if (typeof _dsSettings.constructor.not_found !== 'undefined') {
                            _dsSettings.constructor.not_found(data);
                        }
                        _dsPagination(_dsSettings, {total: 1});
                        _dsLabelTotal(_dsSettings, 3, {total_rows: data.total_rows});
                    }
                }
            });
        },

        /**
         * @desc Builds paging
         * @param _dsSettings
         * @param pg
         * @returns {boolean}
         * @private
         */
        _dsPagination = function (_dsSettings, pg) {
            if (!_dsSettings.pagination.active) {
                return false;
            }
            var pNow = _dsPaginationGet(_dsSettings),
                pTot = pg.total,
                start = ((pNow - 2) < 1) ? 1 : pNow - 2,
                end,
                dsb_hBack = '',
                dsb_hNext = '';

            if ((start + 4) <= pTot) {
                end = start + 4;
            } else if ((start + 3) <= pTot) {
                end = start + 3;
                start = ((pNow - 3) < 1) ? 1 : pNow - 3;
            } else {
                end = pTot;
                start = ((pNow - 4) < 1) ? 1 : pNow - 4;
            }

            if (pNow === 1) {
                dsb_hBack = 'disabled';
            }
            if (pNow === pTot) {
                dsb_hNext = 'disabled';
            }

            var hStart = '<li><a href="' + updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: 1,
                        update: false,
                        _dsSettings: _dsSettings
                    }) + '" data-page="1">1...</a></li>',
                hEnd = '<li><a href="' + updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: pTot,
                        update: false,
                        _dsSettings: _dsSettings
                    }) + '" data-page="' + pTot + '">...' + pTot + '</a></li>',
                hBack = '<li class="' + dsb_hBack + '"><a href="' + updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: (pNow - 1),
                        update: false,
                        _dsSettings: _dsSettings
                    }) + '" data-page="' + (pNow - 1) + '"><span aria-hidden="true">&laquo;</span></a></li>',
                hNext = '<li class="' + dsb_hNext + '"><a href="' + updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: (pNow + 1),
                        update: false,
                        _dsSettings: _dsSettings
                    }) + '" data-page="' + (pNow + 1) + '"><span aria-hidden="true">&raquo;</span></a></li>',
                hCtt = '',
                hNav = '',
                ih;


            for (var i = start; i <= end; i++) {
                var act = '';
                if (i === pNow) {
                    act = 'active';
                }
                hCtt += '<li class="' + act + '"><a href="' + updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: i,
                        update: false,
                        _dsSettings: _dsSettings
                    }) + '" data-page="' + i + '">' + i + '</a></li>';
            }

            if (end <= (pTot - 1)) {
                hCtt += hEnd;
            }
            if (start >= 2) {
                hCtt = hStart + hCtt;
            }

            hNav = hBack + hCtt + hNext;
            ih = $("#" + _dsSettings.id + "  [name='" + _dsSettings._dsEmtName.pagination + "']").html(hNav);

            $(ih).find('li').click(function (event) {
                event.preventDefault();

                if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                    return false;
                } else {
                    $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.pagination + "']").find('li').removeClass('active');
                    $(this).addClass('active');
                    if (_dsSettings.urlParam.active == true) {
                        updateParam({
                            param: _dsSettings._dsEmtName.urlPg,
                            value: $(this).find('a').data('page'),
                            update: true,
                            _dsSettings: _dsSettings,
                            redirect: true
                        });
                    } else {
                        _dsAjax(_dsSettings);
                    }
                }
            });
        },

        /**
         * @desc Trigger the search
         * @param _dsSettings
         * @returns {boolean}
         * @private
         */
        _dsSearch = function (_dsSettings) {
            if (!_dsSettings.search.active) {
                return false;
            }

            var val,
                elm = $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']");

            if (_dsSettings.urlParam.active == true) {
                if (getParam(_dsSettings._dsEmtName.urlSc) != '') {
                    elm.each(function () {
                        $(this).val(getParam(_dsSettings._dsEmtName.urlSc));
                    });
                }
            }

            elm.keyup(function (e) {
                if (_dsSettings.search.autosearch || e.which === 13) {
                    val = $(this).val();
                    elm.each(function () {
                        $(this).val(val);
                    });

                    if (_dsSettings.urlParam.active == true) {
                        updateParam({
                            param: _dsSettings._dsEmtName.urlPg,
                            value: 1,
                            update: true,
                            _dsSettings: _dsSettings,
                            redirect: false
                        });
                        updateParam({
                            param: _dsSettings._dsEmtName.urlSc,
                            value: val,
                            update: true,
                            _dsSettings: _dsSettings,
                            redirect: true
                        });
                    } else {
                        _trigger_dsAjax(_dsSettings);
                    }
                }
            });
        },

        /**
         * @desc Trigger records per page
         * @param _dsSettings
         * @returns {boolean}
         * @private
         */
        _dsRecordPages = function (_dsSettings) {
            if (!_dsSettings.recordsPage.active) {
                return false;
            }
            var val,
                elm = $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']");

            if (_dsSettings.urlParam.active == true) {
                if (getParam(_dsSettings._dsEmtName.urlRd) != '') {
                    elm.each(function () {
                        $(this).val(getParam(_dsSettings._dsEmtName.urlRd));
                    });
                }
            }

            elm.change(function () {
                val = $(this).val();
                elm.each(function () {
                    $(this).val(val);
                });

                if (_dsSettings.urlParam.active == true) {
                    updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: 1,
                        update: true,
                        _dsSettings: _dsSettings,
                        redirect: false
                    });
                    updateParam({
                        param: _dsSettings._dsEmtName.urlRd,
                        value: val,
                        update: true,
                        _dsSettings: _dsSettings,
                        redirect: true
                    });
                } else {
                    _trigger_dsAjax(_dsSettings);
                }


            });
        },

        /**
         * @desc Trigger ordination
         * @param _dsSettings
         * @returns {boolean}
         * @private
         */
        _dsOrder = function (_dsSettings) {
            if (!_dsSettings.order.active) {
                return false;
            }
            var val,
                elm = $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']");

            if (_dsSettings.urlParam.active == true) {
                if (getParam(_dsSettings._dsEmtName.urlOr) != '') {
                    elm.each(function () {
                        $(this).val(getParam(_dsSettings._dsEmtName.urlOr));
                    });
                }
            }
            elm.change(function () {
                val = $(this).val();
                elm.each(function () {
                    $(this).val(val);
                });

                if (_dsSettings.urlParam.active == true) {
                    updateParam({
                        param: _dsSettings._dsEmtName.urlPg,
                        value: 1,
                        update: true,
                        _dsSettings: _dsSettings,
                        redirect: false
                    });
                    updateParam({
                        param: _dsSettings._dsEmtName.urlOr,
                        value: val,
                        update: true,
                        _dsSettings: _dsSettings,
                        redirect: true
                    });
                } else {
                    _trigger_dsAjax(_dsSettings);
                }

            });
        },

        /**
         * @desc builds totals label
         * @param _dsSettings
         * @param type = 1 (Loading)
         * @param type = 2 (Totais)
         * @param type = 3 (Records not found)
         * @param page
         * @returns {boolean}
         * @private
         */
        _dsLabelTotal = function (_dsSettings, type, page) {
            if (!_dsSettings.labelTotal.active) {
                return false;
            }
            var op = _dsSettings.labelTotal,
                html;
            if (type === 2) {
                html = op.showing + ' ' + (page.start + 1) + ' ' + op.to + ' ' + page.end + ' ' + op.of + ' ' + page.rows + ' ' + op.entries;
                if (page.rows !== page.total_rows) {
                    html += ' - ' + op.filter + ' ' + page.total_rows + ' ' + op.values_in_total;
                }
                $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.totais + "']").html(html);
            } else if (type === 3) {
                html = op.records_not_found;
                if (page.total_rows !== '0') {
                    html += ' - ' + op.filter + ' ' + page.total_rows + ' ' + op.values_in_total;
                }
                $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.totais + "']").html(html);
            } else if (type === 1) {
                $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.totais + "']").html(op.loading);
            }
        },

        /**
         * @desc Trigger for AJAX function used when "urlParam = false"
         * @param _dsSettings
         * @private
         */
        _trigger_dsAjax = function (_dsSettings) {
            _dsPagination(_dsSettings, {total: 1});
            _dsAjax(_dsSettings);
        },

        /**
         * @desc Constructor function
         * @param options
         * @returns {_dsDataTableGrid}
         * @private
         */
        _dsDataTableGrid = function (options) {
            var _dsSettings = _mergeSettings(options);

            _dsSettings.element = this;

            _dsSettings.id = $(this).attr('id');

            _dsSearch(_dsSettings);

            _dsRecordPages(_dsSettings);

            _dsOrder(_dsSettings);

            _dsLabelTotal(_dsSettings, 1, null);

            _trigger_dsAjax(_dsSettings);

            return this;
        };

    jQuery.fn.dsDataTable = _dsDataTableGrid;
})(jQuery);