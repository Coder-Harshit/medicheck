import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SSIFormData } from '@/app/interfaces';
import { exportToCSV } from '@/utils/exportToCSV';

interface ExportModalProps {
    data: SSIFormData[];
}

const ExportModal: React.FC<ExportModalProps> = ({ data }) => {
    const [selectedPatients, setSelectedPatients] = React.useState<string[]>([]);
    const [range, setRange] = React.useState<{ start: string; end: string }>({ start: '', end: '' });

    const handleExport = () => {
        let filteredData = data;

        if (selectedPatients.length > 0) {
            const selectedPatientIds = selectedPatients.map(id => parseInt(id, 10));
            filteredData = data.filter((patient) => selectedPatientIds.includes(Number(patient.patientId)));
        } else if (range.start && range.end) {
            const startId = parseInt(range.start, 10);
            const endId = parseInt(range.end, 10);
            filteredData = data.filter((patient) => Number(patient.patientId) >= startId && Number(patient.patientId) <= endId);
        }

        exportToCSV(filteredData, 'handpicked_patients.csv');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg">
                    Export Handpicked to CSV
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Handpicked Patients</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Patients</label>
                        <Input
                            type="text"
                            placeholder="Enter patient IDs separated by commas"
                            value={selectedPatients.join(', ')}
                            onChange={(e) => setSelectedPatients(e.target.value.split(',').map((id) => id.trim()))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Or Select Range</label>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Start ID"
                                value={range.start}
                                onChange={(e) => setRange({ ...range, start: e.target.value })}
                            />
                            <Input
                                type="text"
                                placeholder="End ID"
                                value={range.end}
                                onChange={(e) => setRange({ ...range, end: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleExport} className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg">
                        Export
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExportModal;