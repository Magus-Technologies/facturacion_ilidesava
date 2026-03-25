@extends('layouts.app', ['title' => 'Editar Venta'])

@section('content')
    <div id="app" data-react-component="VentaForm" data-props='@json(["ventaId" => $ventaId])'></div>
@endsection
