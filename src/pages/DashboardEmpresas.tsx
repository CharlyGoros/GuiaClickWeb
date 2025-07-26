import React from 'react';
import DashboardLayout from './DashboardLayout';
import SuperadminEmpresas from './SuperAdminEmpresas';

const DashboardEmpresasPage: React.FC = () => (
    <DashboardLayout>
        <SuperadminEmpresas />
    </DashboardLayout>
);

export default DashboardEmpresasPage;
