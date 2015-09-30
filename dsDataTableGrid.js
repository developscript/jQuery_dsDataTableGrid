/*!
 *
 * DevelopScript - DataTableGrid v0.6.5 (http://developscript.com)
 *
 * Licensed under the MIT license.
 *
 * @file    dsDataTableGrid.js
 * @author  Rafael Pegorari
 * @date    29/09/2015
 *
 * ====== Required ======
 * This code was developed based on jQuery v2.1.4.
 * More informations
 * jQuery url: https://jquery.com/
 *
 * ====== Globais ======
 * $, jQuery, _dsSettings_default, _mergeSettings, _dsPaginationGet, _dsSerchGet, _dsRecordsGet, _dsAjax, _dsPagination,
 * _dsSearch, _dsRecordPages, _dsLabelTotal, _trigger_dsAjax, _dsDataTableGrid
 */

(function ($) {
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
                order: '_dsOrder'
            }
        },
        _mergeSettings = function (options) {
            return $.extend(true, {}, _dsSettings_default, options);
        },
        _dsPaginationGet = function (_dsSettings) {
            var val;
            if ($("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.pagination + "']").length) {
                val = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.pagination + "']").find('.active').find('a').data("page");
            }
            return Number((isNaN(val)) ? 1 : val);
        },
        _dsSerchGet = function (_dsSettings) {
            var val = '';
            if ($("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']").length) {
                val = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']").val();
            }
            return val;
        },
        _dsRecordsGet = function (_dsSettings) {
            var val = _dsSettings.recordsPage.rows;
            if ($("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']").length) {
                val = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']").val();
            }
            return val;
        },
        _dsOrderGet = function (_dsSettings) {
            var val;
            if ($("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']").length) {
                val = $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']").val();
            }
            return val;
        },
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

            var hStart = '<li><a href="javascript:;" data-page="1">1...</a></li>',
                hEnd = '<li><a href="javascript:;" data-page="' + pTot + '">...' + pTot + '</a></li>',
                hBack = '<li class="' + dsb_hBack + '"><a href="javascript:;" data-page="' + (pNow - 1) + '"><span aria-hidden="true">&laquo;</span></a></li>',
                hNext = '<li class="' + dsb_hNext + '"><a href="javascript:;" data-page="' + (pNow + 1) + '"><span aria-hidden="true">&raquo;</span></a></li>',
                hCtt = '',
                hNav = '',
                ih;


            for (var i = start; i <= end; i++) {
                var act = '';
                if (i === pNow) {
                    act = 'active';
                }
                hCtt += '<li class="' + act + '"><a href="javascript:;" data-page="' + i + '">' + i + '</a></li>';
            }

            if (end <= (pTot - 1)) {
                hCtt += hEnd;
            }
            if (start >= 2) {
                hCtt = hStart + hCtt;
            }

            hNav = hBack + hCtt + hNext;
            ih = $("#" + _dsSettings.id + "  [name='" + _dsSettings._dsEmtName.pagination + "']").html(hNav);

            $(ih).find('li').click(function () {
                if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                    return false;
                } else {
                    $("#" + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.pagination + "']").find('li').removeClass('active');
                    $(this).addClass('active');
                    _dsAjax(_dsSettings);
                }
            });
        },
        _dsSearch = function (_dsSettings) {
            if (!_dsSettings.search.active) {
                return false;
            }
            $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']").keyup(function (e) {
                if (_dsSettings.search.autosearch || e.which === 13) {
                    var value = $(this).val();
                    $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.search + "']").each(function () {
                        $(this).val(value);
                    });
                    _trigger_dsAjax(_dsSettings);
                }
            });
        },
        _dsRecordPages = function (_dsSettings) {
            if (!_dsSettings.recordsPage.active) {
                return false;
            }
            $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']").change(function () {
                var value = $(this).val();
                $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.records + "']").each(function () {
                    $(this).val(value);
                });
                _trigger_dsAjax(_dsSettings);
            });
        },
        _dsOrder = function (_dsSettings) {
            if (!_dsSettings.order.active) {
                return false;
            }
            $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']").change(function () {
                var value = $(this).val();
                $('#' + _dsSettings.id + " [name='" + _dsSettings._dsEmtName.order + "']").each(function () {
                    $(this).val(value);
                });
                _trigger_dsAjax(_dsSettings);
            });
        },
    // type [ Loading => 1,  Totais => 2,  Records not found => 3 ]
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
        _trigger_dsAjax = function (_dsSettings) {
            _dsPagination(_dsSettings, {total: 1});
            _dsAjax(_dsSettings);
        },

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