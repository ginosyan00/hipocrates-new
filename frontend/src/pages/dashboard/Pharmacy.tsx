import React, { useState } from 'react';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Button, Card, Input } from '../../components/common';

// Import pharmacy icon
import pharmacyIcon from '../../assets/icons/pharmacy.svg';
import searchIcon from '../../assets/icons/search.svg';

/**
 * Pharmacy Page - Figma Design
 * Управление медикаментами и аптекой
 */
export const PharmacyPage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Mock data
  const medications = [
    {
      id: '1',
      name: 'Парацетамол',
      dosage: '500mg',
      quantity: 150,
      price: 2500,
      expiryDate: '2025-12-31',
      manufacturer: 'PharmaCorp',
    },
    {
      id: '2',
      name: 'Ибупрофен',
      dosage: '400mg',
      quantity: 85,
      price: 3200,
      expiryDate: '2025-08-15',
      manufacturer: 'MediLife',
    },
    {
      id: '3',
      name: 'Амоксициллин',
      dosage: '250mg',
      quantity: 42,
      price: 5500,
      expiryDate: '2024-11-30',
      manufacturer: 'BioPharm',
    },
    {
      id: '4',
      name: 'Цитрамон',
      dosage: '500mg',
      quantity: 200,
      price: 1800,
      expiryDate: '2026-03-20',
      manufacturer: 'PharmaCorp',
    },
    {
      id: '5',
      name: 'Аспирин',
      dosage: '100mg',
      quantity: 120,
      price: 2100,
      expiryDate: '2025-07-10',
      manufacturer: 'HealthCare',
    },
    {
      id: '6',
      name: 'Витамин C',
      dosage: '1000mg',
      quantity: 95,
      price: 4200,
      expiryDate: '2026-01-25',
      manufacturer: 'VitaPlus',
    },
  ];

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (quantity: number) => {
    if (quantity > 100) {
      return { label: 'В наличии', style: 'bg-secondary-10 text-secondary-100 border-secondary-100/20' };
    } else if (quantity > 50) {
      return { label: 'Заканчивается', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    } else {
      return { label: 'Мало', style: 'bg-red-50 text-red-600 border-red-200' };
    }
  };

  const totalValue = medications.reduce((sum, med) => sum + med.price * med.quantity, 0);
  const lowStockCount = medications.filter(med => med.quantity <= 50).length;

  return (
    <NewDashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-100">Аптека</h1>
          <p className="text-text-10 text-sm mt-1">Всего медикаментов: {medications.length}</p>
        </div>
        <Button variant="primary">➕ Добавить медикамент</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Medications */}
        <Card padding="none" className="p-5">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-main-10 rounded-sm flex items-center justify-center">
              <img src={pharmacyIcon} alt="Pharmacy" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-normal text-text-10 mb-1">Всего медикаментов</p>
              <p className="text-2xl font-medium text-text-100">{medications.length}</p>
            </div>
          </div>
        </Card>

        {/* Total Value */}
        <Card padding="none" className="p-5">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-secondary-10 rounded-sm flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm font-normal text-text-10 mb-1">Общая стоимость</p>
              <p className="text-2xl font-medium text-text-100">{totalValue.toLocaleString()} ֏</p>
            </div>
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card padding="none" className="p-5">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm font-normal text-text-10 mb-1">Малый запас</p>
              <p className="text-2xl font-medium text-red-600">{lowStockCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card padding="md">
        <Input
          placeholder="Поиск медикаментов..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<img src={searchIcon} alt="Search" className="w-4 h-4" />}
        />
      </Card>

      {/* Medications Table */}
      <Card padding="none" className="p-5">
        <h3 className="text-lg font-medium text-text-50 mb-6">Список медикаментов</h3>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b border-stroke mb-4">
          <div className="col-span-3 text-sm font-normal text-text-10">Название</div>
          <div className="col-span-2 text-sm font-normal text-text-10">Дозировка</div>
          <div className="col-span-2 text-sm font-normal text-text-10">Количество</div>
          <div className="col-span-2 text-sm font-normal text-text-10">Цена</div>
          <div className="col-span-2 text-sm font-normal text-text-10">Срок годности</div>
          <div className="col-span-1 text-sm font-normal text-text-10">Статус</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-4">
          {filteredMedications.length === 0 ? (
            <div className="text-center py-8 text-text-10 text-sm">
              Медикаменты не найдены
            </div>
          ) : (
            filteredMedications.map(medication => {
              const stockStatus = getStockStatus(medication.quantity);
              return (
                <div key={medication.id} className="grid grid-cols-12 gap-4 items-center hover:bg-bg-primary transition-smooth rounded-sm p-2 -mx-2">
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-main-10 rounded-sm flex items-center justify-center">
                        <img src={pharmacyIcon} alt="Med" className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-100">{medication.name}</p>
                        <p className="text-[10px] text-text-10">{medication.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs font-medium text-text-50">
                    {medication.dosage}
                  </div>
                  <div className="col-span-2 text-xs font-medium text-text-100">
                    {medication.quantity} шт
                  </div>
                  <div className="col-span-2 text-xs font-medium text-text-100">
                    {medication.price.toLocaleString()} ֏
                  </div>
                  <div className="col-span-2 text-xs font-normal text-text-50">
                    {new Date(medication.expiryDate).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 border rounded-sm text-[10px] font-normal ${stockStatus.style}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
      </div>
    </NewDashboardLayout>
  );
};





