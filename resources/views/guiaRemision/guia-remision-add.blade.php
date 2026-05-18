@extends('layouts.app', ['title' => 'Nueva Guía de Remisión'])

@section('content')
    <div id="app" data-react-component="GuiaRemisionForm" data-props="{{ json_encode(['guia_id' => $guia_id ?? null]) }}"></div>
@endsection
