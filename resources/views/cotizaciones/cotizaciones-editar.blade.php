@extends('layouts.app', ['title' => 'Editar Cotización'])

@section('content')
    <div id="app" data-react-component="CotizacionForm" data-props='{"cotizacionId": {{ $id }}}'></div>
@endsection
