@extends('layouts.app', ['title' => 'Editar Compra'])

@section('content')
    <div id="app" data-react-component="CompraForm" data-props='{"compraId": {{ $id }}}'></div>
@endsection
