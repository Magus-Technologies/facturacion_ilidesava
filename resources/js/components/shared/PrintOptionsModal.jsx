import { Printer, FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { useState } from 'react';

/**
 * Modal para mostrar preview de PDF y opciones de impresión
 */
export default function PrintOptionsModal({ isOpen, onClose, ventaId, numeroCompleto }) {
    const [formato, setFormato] = useState('ticket'); // 'ticket' o 'a4'

    const getPdfUrl = () => {
        if (formato === 'ticket') {
            return `/reporteNV/ticket.php?id=${ventaId}`;
        } else {
            return `/reporteNV/a4.php?id=${ventaId}`;
        }
    };

    const handlePrint = () => {
        const iframe = document.getElementById('pdf-preview');
        if (iframe) {
            iframe.contentWindow.print();
        }
    };

    const handleDownload = () => {
        window.open(getPdfUrl(), '_blank');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Documento Nro: ${numeroCompleto}`}
            size="xl"
            closeOnOverlayClick={false}
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
                {/* Botones de formato */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => setFormato('a4')}
                        variant={formato === 'a4' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        A4
                    </Button>
                    <Button
                        onClick={() => setFormato('ticket')}
                        variant={formato === 'ticket' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Voucher 8cm
                    </Button>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Descargar
                    </Button>
                    <Button
                        onClick={handlePrint}
                        size="sm"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>

            {/* PDF Preview */}
            <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
                <iframe
                    id="pdf-preview"
                    key={formato}
                    src={getPdfUrl()}
                    className="w-full h-full border-0 bg-white"
                    title="Vista previa del documento"
                    style={{ backgroundColor: 'white' }}
                />
            </div>
        </Modal>
    );
}
