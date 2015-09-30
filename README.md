# jQuery_dsDataTableGrid

_dsDataTableGrid is a plugin for [jQuery](//jquery.com) that works with AJAX requests. With some setting you build a dynamic grid, ideal for catalog products.

### [Exemple...](http://developscript.github.io/jQuery_dsDataTableGrid/)

## Having support

* Search, configuration:
  * Enable or disable
  * Autosearch enable or disable

* Records per page, Configuration:
  * Enable or disable
  
* Pagination, Configuration:
  * Enable or disable
  
* Ordering, Configuration:
  * Enable or disable
  
* Totals label, Configuration:
  * Enable or disable
  * Display text
  * Loading text
  * Filter text

## Installation
The installation is to add javascripts, jQuery and dsDatatableGrid.
The plugin was developed based on version of jQuery-2.1.4.

**Scripts JavaScript**
```html
<script src="lib/jquery-2.1.4.js" type="text/javascript"></script>
<script src="dsDataTableGrid.js" type="text/javascript"></script>
```

## Simple application

**Style CSS**
```html
<link href='https://fonts.googleapis.com/css?family=Roboto:400,700,500' rel='stylesheet' type='text/css'>
<link href="lib/bootstrap-3.3.5/css/bootstrap.css" rel="stylesheet">
<link href="style.css" rel="stylesheet">
```

**HTML**
```html
<!-- id that is passed to the plugin, id="list_grid" -->
<div id="list_grid">
    <div class="row">
        <div class="col-md-12">
            <div class="form-group">
                <label class="control-label">Search</label>

                <!-- input search, name="_dsSearch" -->
                <input class="form-control" name="_dsSearch">
            </div>

        </div>
    </div>

    <div class="row border-bottom">
        <div class="col-md-6">

            <!-- It shows the total records, name="_dsTotais" -->
            <div name="_dsTotais" class="total"></div>
        </div>
        <div class="col-md-6">
            <div class="form-group pull-right">
                <label class="control-label">Sort by</label>

                <!-- select order, name="_dsOrder" -->
                <select class="form-control" name="_dsOrder">
                    <option value="">Select</option>
                    <option value="ASC">a-z</option>
                    <option value="DESC">z-a</option>
                </select>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group pull-left">
                        <label class="control-label">Display</label>

                        <!-- select records per page, name="_dsRecords" -->
                        <select class="form-control" name="_dsRecords">
                            <option value="9">9</option>
                            <option value="18">18</option>
                            <option value="27">27</option>
                        </select>
                        <label class="control-label">per page</label>
                    </div>
                </div>
                <div class="col-md-8">
                    <nav>

                        <!-- ul pagination, name="_dsPagination" -->
                        <ul class="pagination pull-right" name="_dsPagination"></ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- list box that is handled in the constructor function, id="grid" -->
    <div id="grid" class="box_list"></div>

    <!-- box not found, it is handled in not_found function. id="not_found" -->
    <div class="row not_found" id="not_found">
        <div class="col-md-12">
            <h1>No products were found.</h1>
        </div>
    </div>

    <div class="row border-bottom">
        <div class="col-md-6">

            <!-- It shows the total records, name="_dsTotais" -->
            <div name="_dsTotais" class="total"></div>
        </div>
        <div class="col-md-6">
            <div class="form-group pull-right">
                <label class="control-label">Sort by</label>

                <!-- select order, name="_dsOrder" -->
                <select class="form-control" name="_dsOrder">
                    <option value="">Select</option>
                    <option value="ASC">a-z</option>
                    <option value="DESC">z-a</option>
                </select>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group pull-left">
                        <label class="control-label">Display</label>

                        <!-- select records per page, name="_dsRecords" -->
                        <select class="form-control" name="_dsRecords">
                            <option value="9">9</option>
                            <option value="18">18</option>
                            <option value="27">27</option>
                        </select>
                        <label class="control-label">per page</label>
                    </div>
                </div>
                <div class="col-md-8">

                    <!-- ul pagination, name="_dsPagination" -->
                    <ul class="pagination pull-right" name="_dsPagination"></ul>
                </div>
            </div>
        </div>
    </div>
</div>
```

**JavaScript**
```javascript
/*
  ====== Function contruct ======
  Parameter "data" is returned from the back-end is a reference of the field array.
*/
var contruct_grid = function (data) {
    $('#not_found').hide();
    $('#grid').show();

    $('#grid').html('');
    var html = [];
    html.push('<div class="row">');
    html.push('<div class="col-md-12">');
    html.push('<div class="row">');
    $.each(data, function (index, value) {
        html.push('<div class="col-md-4 col-sm-6 col-xs-12 produto">');

            html.push('<a href="javascript:;">');
                html.push('<div class="hover">');
                    html.push('<div class="img">');
                        html.push('<img src="http://php.developscript.com/jquery_dsdatatablegrid/img/' + value['id'] + '.png" />');
                    html.push('</div>');
                    html.push('<div class="desc">');
                        html.push('<h3>' + value['name'] + '</h3>');
                    html.push('</div>');
                    html.push('<div class="price">');
                        html.push('<h3>$ ' + value['price'] + '</h3>');
                    html.push('</div>');
                html.push('</div>');
                html.push('<div class="link">');
                    html.push('<span class="btn btn-primary btn-ver">Ver</span>');
                html.push('</div>');
            html.push('</a>');

        html.push('</div>')
    });
    html.push('</div>');
    html.push('</div>');
    html.push('</div>');
    $(html.join('')).appendTo($('#grid'));
};

/*
    ====== Function not found records ======
    parameter "data" is returned from the back-end makes reference to every request.
 */
var not_found = function (data) {
    $('#not_found').show();
    $('#grid').hide();
};

/*
    ====== Call the plugin ======
*/
$('#list_grid').dsDataTable({
    ajax: {
        url: 'http://php.developscript.com/jquery_dsdatatablegrid/ajaxPDO.php',
        type: 'POST',
        addData: {yourData: 'yourValue'}
    },
    constructor: {
        found: contruct_grid,
        not_found: not_found
    }
});
```

## Default settings

```javascript
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
```

## All settings 

```javascript
$('#list_grid').dsDataTable({
    labelTotal: {
        active: true || false,
        showing: '*********',
        to: '***',
        of: '***',
        entries: '*********',
        loading: '*********',
        filter: '*********',
        values_in_total: '*********',
        records_not_found: '*********'
    },
    search: {
        active: true || false,
        autosearch: true || false
    },
    recordsPage: {
        active: true || false
    },
    pagination: {
        active: true || false
    },
    order: {
        active: true || false
    },
    _dsEmtName: {
        records: '*********',
        pagination: '*********',
        search: '*********',
        totais: '*********',
        order: '*********'
    },
    // ==== required ====
    ajax: {
        url: '*********',
        type: 'POST||GET|| ...',
        addData: {yourData: 'yourValue'} // ==== optional ====
    },
    // ==== required ====
    constructor: {
        found: contruct_grid,
        not_found: not_found // ==== optional ====
    }
});
```

## Back-End

* Get
```php
/* 
* ====== Example in PHP. ======
* === Sample file ajaxPDO.php. ===
*
* ['dsRecordPages']    => Amounts of records per page.
* ['dsSearch']         => String to input search.
* ['dsPageNow']        => Current page.
* ['dsOrder']          => Order of the columns.
*/
```

* Returns
```php
/* 
* ====== Example in PHP. ======
* === Sample file ajaxPDO.php. ===
*
* $return['total_rows']  => Total table rows.
* $return['rows']        => Total table rows - query.
* $return['pages']       => Full table pages = ceil($total_rows_query / $_POST['dsRecordPages']).
* $return['fields'][]    => Fields that are sent to construct function.
* $return['start']       => Start to limit.
* $return['end']         => End to limit = $start_from + $fields->rowCount().
*/
```
