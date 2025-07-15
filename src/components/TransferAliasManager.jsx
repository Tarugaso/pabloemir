import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const TransferAliasManager = ({ participants, onUpdateParticipant }) => {
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [transferInfo, setTransferInfo] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveTransferInfo = () => {
    if (editingParticipant && transferInfo.trim()) {
      onUpdateParticipant(editingParticipant.id, {
        ...editingParticipant,
        transferInfo: transferInfo.trim()
      });
      setTransferInfo('');
      setEditingParticipant(null);
      setIsDialogOpen(false);
    }
  };

  const handleEditTransferInfo = (participant) => {
    setEditingParticipant(participant);
    setTransferInfo(participant.transferInfo || '');
    setIsDialogOpen(true);
  };

  const handleRemoveTransferInfo = (participant) => {
    onUpdateParticipant(participant.id, {
      ...participant,
      transferInfo: ''
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copiado al portapapeles');
    });
  };

  const participantsWithTransferInfo = participants.filter(p => p.transferInfo);
  const participantsWithoutTransferInfo = participants.filter(p => !p.transferInfo);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <Card className="border-river-red/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {participants.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Participantes</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {participantsWithTransferInfo.length}
              </div>
              <div className="text-sm text-muted-foreground">Con Datos Bancarios</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {participantsWithoutTransferInfo.length}
              </div>
              <div className="text-sm text-muted-foreground">Sin Datos Bancarios</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participantes con información de transferencia */}
      {participantsWithTransferInfo.length > 0 && (
        <Card className="border-river-red/20">
          <CardHeader>
            <CardTitle className="text-river-red flex items-center gap-2">
              ✅ Participantes con Datos Bancarios
            </CardTitle>
            <CardDescription>
              Información disponible para transferencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participantsWithTransferInfo.map(participant => (
                <Card key={participant.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{participant.name}</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Configurado
                          </Badge>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-green-200">
                          <div className="text-sm font-medium text-green-700 mb-1">
                            Información de transferencia:
                          </div>
                          <div className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                            {participant.transferInfo}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(participant.transferInfo)}
                          className="border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white"
                        >
                          📋 Copiar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTransferInfo(participant)}
                          className="border-blue-500/30 text-blue-600 hover:bg-blue-500 hover:text-white"
                        >
                          ✏️ Editar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTransferInfo(participant)}
                          className="border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white"
                        >
                          🗑️ Quitar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participantes sin información de transferencia */}
      {participantsWithoutTransferInfo.length > 0 && (
        <Card className="border-river-red/20">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              ⚠️ Participantes sin Datos Bancarios
            </CardTitle>
            <CardDescription>
              Agrega información bancaria para facilitar las transferencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participantsWithoutTransferInfo.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="font-medium">{participant.name}</span>
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                      Sin configurar
                    </Badge>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTransferInfo(participant)}
                    className="border-river-red/30 text-river-red hover:bg-river-red hover:text-white"
                  >
                    ➕ Agregar Datos
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {participants.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-xl font-semibold text-muted-foreground mb-2">
              No hay participantes agregados
            </div>
            <div className="text-muted-foreground">
              Agrega participantes en la pestaña &quot;Participantes&quot; para gestionar sus datos bancarios
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para editar información de transferencia */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-river-red">
              💳 {editingParticipant ? `Datos bancarios de ${editingParticipant.name}` : 'Agregar datos bancarios'}
            </DialogTitle>
            <DialogDescription>
              Agrega información como CBU, alias, número de cuenta, etc.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="transfer-info">Información de transferencia</Label>
              <Textarea
                id="transfer-info"
                placeholder="Ejemplo:&#10;CBU: 0000003100010000000001&#10;Alias: mi.alias.bancario&#10;Banco: Banco Ejemplo&#10;Titular: Juan Pérez"
                value={transferInfo}
                onChange={(e) => setTransferInfo(e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              💡 Tip: Incluye toda la información necesaria para que otros puedan transferirte dinero fácilmente
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveTransferInfo}
                disabled={!transferInfo.trim()}
                className="bg-river-red hover:bg-river-red-dark"
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferAliasManager;
