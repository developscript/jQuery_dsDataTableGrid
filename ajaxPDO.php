<?php

/* !
 * 
 * DevelopScript - DataTableGrid v0.6.5 (http://developscript.com)
 * 
 * Licensed under the MIT license.
 * 
 * @file            ajaxPDO.php
 * @author          Rafael Pegorari
 * @date            29/09/2015
 * 
 * 
 * ====== Get ======
 * ['dsRecordPages']    => Amounts of records per page.
 * ['dsSearch']         => String to input search.
 * ['dsPageNow']        => Current page.
 * ['dsOrder']          => Order of the columns.
 * 
 * 
 * ====== Returns ======
 * $return['total_rows']  => Total table rows.
 * $return['rows']        => Total table rows - query.
 * $return['pages']       => Full table pages = ceil($total_rows_query / $_POST['dsRecordPages']).
 * $return['fields'][]    => Fields that are sent to construct function.
 * $return['start']       => Start to limit.
 * $return['end']         => End to limit = $start_from + $fields->rowCount().
 * 
 */

header('Content-type: application/json');

try {
    $conn = new PDO(
        'mysql:host=localhost; dbname=database', 'root', 'password'
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //====== ARRAY RETURN ======
    $return = array();

    //====== SELECT ======
    $select = "SELECT * FROM products ";

    //====== WHERE ======
    $where = '';
    if (isset($_POST['dsSearch']) && $_POST['dsSearch'] != '') {
        $where .= " WHERE name LIKE '%" . $_POST['dsSearch'] . "%' ";
    }

    //====== LIMIT ======
    $start_from = ($_POST['dsPageNow'] - 1) * $_POST['dsRecordPages'];
    $limit = " LIMIT " . $start_from . ", " . $_POST['dsRecordPages'];

    //====== ORDER ======
    $order = '';
    if (isset($_POST['dsOrder']) && $_POST['dsOrder'] != '') {
        $order = " ORDER BY name " . $_POST['dsOrder'] . " ";
    }

    //====== TOTAL PG ======
    $total_rows = $conn->query($select)->rowCount();
    $total_rows_query = $conn->query($select . $where)->rowCount();
    $total_pages = ceil($total_rows_query / $_POST['dsRecordPages']);

    $return['total_rows'] = $total_rows;
    $return['rows'] = $total_rows_query;
    $return['pages'] = $total_pages;


    //====== FIELDS ======
    if ($total_rows_query != 0) {
        $fields = $conn->query($select . $where . $order . $limit);
        foreach ($fields->fetchAll(\PDO :: FETCH_ASSOC) as $key => $value) {
            $return['fields'][$key] = array_map('utf8_encode', $value);
        }
        $return['start'] = $start_from;
        $return['end'] = $start_from + $fields->rowCount();
    }

    echo json_encode($return);

} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}