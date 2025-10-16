import React, { useState, useEffect } from 'react';
import { Download, Eye, CreditCard, QrCode, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';

const IDCardGenerator = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [cardData, setCardData] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cardType, setCardType] = useState('id'); // 'id' or 'visiting'

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/admin/department/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setDepartments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchEmployees = async (departmentId) => {
        try {
            const token = localStorage.getItem('token');
            // This would need to be implemented in the backend
            const response = await axios.get(`/api/v1/admin/employees?departmentId=${departmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Mock data for demonstration
            setEmployees([
                { _id: '1', name: 'John Doe', employeeCode: 'IT24001' },
                { _id: '2', name: 'Jane Smith', employeeCode: 'IT24002' }
            ]);
        }
    };

    const generateCard = async () => {
        if (!selectedEmployee) {
            toast.error('Please select an employee');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = cardType === 'id' ? 'id-card' : 'visiting-card';
            
            const response = await axios.get(
                `/api/v1/both/card-generation/${endpoint}/${selectedEmployee}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setCardData(response.data.data);
                
                // Generate QR code if it's an ID card
                if (cardType === 'id' && response.data.data.qrCodeData) {
                    const qrUrl = await QRCode.toDataURL(JSON.stringify(response.data.data.qrCodeData));
                    setQrCodeUrl(qrUrl);
                }
                
                toast.success(`${cardType === 'id' ? 'ID' : 'Visiting'} card generated successfully`);
            }
        } catch (error) {
            console.error('Error generating card:', error);
            toast.error('Failed to generate card');
        } finally {
            setIsLoading(false);
        }
    };

    const generateBulkCards = async () => {
        if (!selectedDepartment) {
            toast.error('Please select a department');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/v1/both/card-generation/bulk-id-cards/${selectedDepartment}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success(`Generated ${response.data.data.length} ID cards successfully`);
                // Handle bulk download or display
            }
        } catch (error) {
            console.error('Error generating bulk cards:', error);
            toast.error('Failed to generate bulk cards');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCard = () => {
        if (!cardData) return;
        
        // Create a printable version
        const printWindow = window.open('', '_blank');
        printWindow.document.write(generateCardHTML());
        printWindow.document.close();
        printWindow.print();
    };

    const generateCardHTML = () => {
        if (!cardData) return '';

        const isIDCard = cardType === 'id';
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${isIDCard ? 'Employee ID Card' : 'Visiting Card'}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f0f0f0;
                    }
                    .card { 
                        width: ${isIDCard ? '340px' : '356px'}; 
                        height: ${isIDCard ? '215px' : '204px'}; 
                        background: white; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        padding: 20px;
                        margin: 0 auto;
                        position: relative;
                        border: 2px solid #2563eb;
                    }
                    .header { 
                        background: linear-gradient(135deg, #2563eb, #1d4ed8); 
                        color: white; 
                        padding: 10px; 
                        border-radius: 8px; 
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
                    .card-type { font-size: 12px; opacity: 0.9; }
                    .content { display: flex; align-items: center; gap: 15px; }
                    .photo { 
                        width: 80px; 
                        height: 80px; 
                        border-radius: 50%; 
                        background: #e5e7eb; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 24px;
                        color: #6b7280;
                    }
                    .info { flex: 1; }
                    .name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
                    .title { font-size: 14px; color: #6b7280; margin-bottom: 3px; }
                    .department { font-size: 12px; color: #9ca3af; margin-bottom: 8px; }
                    .details { font-size: 11px; color: #6b7280; line-height: 1.4; }
                    .qr-section { position: absolute; bottom: 10px; right: 10px; }
                    .qr-code { width: 50px; height: 50px; }
                    .footer { 
                        position: absolute; 
                        bottom: 10px; 
                        left: 20px; 
                        font-size: 10px; 
                        color: #9ca3af; 
                    }
                    @media print {
                        body { background: white; }
                        .card { box-shadow: none; border: 2px solid #2563eb; }
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <div class="company-name">Your Company Name</div>
                        <div class="card-type">${isIDCard ? 'Employee ID Card' : 'Business Card'}</div>
                    </div>
                    <div class="content">
                        <div class="photo">👤</div>
                        <div class="info">
                            <div class="name">${cardData.name}</div>
                            <div class="title">${cardData.jobTitle}</div>
                            <div class="department">${cardData.department}</div>
                            <div class="details">
                                ${isIDCard ? `ID: ${cardData.employeeCode}<br>` : ''}
                                Email: ${cardData.email}<br>
                                ${cardData.phone ? `Phone: ${cardData.phone}<br>` : ''}
                                ${isIDCard ? `Joined: ${new Date(cardData.joiningDate).toLocaleDateString()}` : ''}
                            </div>
                        </div>
                    </div>
                    ${isIDCard && qrCodeUrl ? `
                        <div class="qr-section">
                            <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
                        </div>
                    ` : ''}
                    <div class="footer">
                        ${isIDCard ? `Valid until: ${new Date(cardData.validUntil).toLocaleDateString()}` : 'www.yourcompany.com'}
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">ID Card Generator</h1>
                    <p className="text-gray-600">Generate employee ID cards and visiting cards</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Type
                        </label>
                        <select
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="id">ID Card</option>
                            <option value="visiting">Visiting Card</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => {
                                setSelectedDepartment(e.target.value);
                                if (e.target.value) {
                                    fetchEmployees(e.target.value);
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee
                        </label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!selectedDepartment}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name} ({emp.employeeCode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end space-x-2">
                        <button
                            onClick={generateCard}
                            disabled={isLoading || !selectedEmployee}
                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                        </button>
                        
                        <button
                            onClick={generateBulkCards}
                            disabled={isLoading || !selectedDepartment}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Users className="w-4 h-4" />
                            <span>Bulk</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Card Preview */}
            {cardData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {cardType === 'id' ? 'ID Card' : 'Visiting Card'} Preview
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={downloadCard}
                                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>

                    {/* Card Design */}
                    <div className="flex justify-center">
                        <div className={`bg-white border-2 border-blue-500 rounded-xl shadow-lg ${
                            cardType === 'id' ? 'w-80 h-52' : 'w-96 h-56'
                        } p-4 relative`}>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-lg mb-4 text-center">
                                <div className="font-bold text-lg">Your Company Name</div>
                                <div className="text-xs opacity-90">
                                    {cardType === 'id' ? 'Employee ID Card' : 'Business Card'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500">
                                    👤
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg text-gray-800">{cardData.name}</div>
                                    <div className="text-sm text-gray-600">{cardData.jobTitle}</div>
                                    <div className="text-xs text-gray-500 mb-2">{cardData.department}</div>
                                    <div className="text-xs text-gray-600">
                                        {cardType === 'id' && <div>ID: {cardData.employeeCode}</div>}
                                        <div>Email: {cardData.email}</div>
                                        {cardData.phone && <div>Phone: {cardData.phone}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* QR Code for ID cards */}
                            {cardType === 'id' && qrCodeUrl && (
                                <div className="absolute bottom-2 right-2">
                                    <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12" />
                                </div>
                            )}

                            {/* Footer */}
                            <div className="absolute bottom-2 left-4 text-xs text-gray-500">
                                {cardType === 'id' 
                                    ? `Valid until: ${new Date(cardData.validUntil).toLocaleDateString()}`
                                    : 'www.yourcompany.com'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IDCardGenerator;
