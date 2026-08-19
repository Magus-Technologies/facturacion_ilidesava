@extends('layouts.app', ['title' => isset($nota_id) ? 'Editar Nota de Crédito' : 'Nueva Nota de Crédito'])

@section('content')
    <div id="app" data-react-component="NotaCreditoForm" data-props="{{ json_encode(['nota_id' => $nota_id ?? null]) }}"></div>
@endsection
