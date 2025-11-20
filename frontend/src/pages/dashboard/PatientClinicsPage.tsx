import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewDashboardLayout } from '../../components/dashboard/NewDashboardLayout';
import { Card, Button, Spinner } from '../../components/common';
import { useClinics, useCities } from '../../hooks/usePublic';
import { Clinic } from '../../types/api.types';

// Import icons
import searchIcon from '../../assets/icons/search.svg';

/**
 * PatientClinicsPage
 * Страница списка клиник для пациентов (внутри dashboard)
 */
export const PatientClinicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const { data: citiesData } = useCities();
  const { data, isLoading, error } = useClinics({ city: selectedCity || undefined });

  const cities = citiesData || [];
  const clinics = data?.data || [];

  const handleClinicClick = (clinic: Clinic) => {
    // Redirect to clinic's public page via landing
    navigate(`/clinic/${clinic.slug}`);
  };

  return (
    <NewDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-100">Клиники</h1>
          <p className="text-sm text-text-10 mt-1">Выберите клинику для записи на приём</p>
        </div>

        {/* Filter Card */}
        <Card padding="md" className="max-w-md">
          <label className="block text-sm font-normal text-text-10 mb-2">Фильтр по городу</label>
          <div className="relative">
            <img 
              src={searchIcon} 
              alt="Search" 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-stroke rounded-sm bg-bg-white text-sm text-text-100 focus:outline-none focus:border-main-100 transition-smooth"
            >
              <option value="">Все города</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <p className="text-red-600 text-sm">Ошибка загрузки клиник. Попробуйте позже.</p>
          </Card>
        )}

        {/* Clinics Grid */}
        {!isLoading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-text-10">
                Найдено клиник: <span className="font-medium text-text-100">{clinics.length}</span>
              </p>
            </div>

            {clinics.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-main-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-main-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-text-50 text-lg">Клиники не найдены</p>
                  <p className="text-text-10 text-sm mt-2">Попробуйте изменить фильтр</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map((clinic: Clinic) => (
                  <Card 
                    key={clinic.id} 
                    padding="none" 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleClinicClick(clinic)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Clinic Logo or Icon */}
                      {clinic.logo ? (
                        <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                          <img src={clinic.logo} alt={clinic.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-main-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <span className="text-3xl">🏥</span>
                        </div>
                      )}

                      {/* Clinic Name */}
                      <h3 className="text-lg font-semibold text-text-100 text-center">{clinic.name}</h3>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-text-50">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{clinic.city}</span>
                        </div>
                        {clinic.address && (
                          <div className="flex items-start gap-2 text-sm text-text-10">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-2">{clinic.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-text-50">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{clinic.phone}</span>
                        </div>
                      </div>

                      {/* About */}
                      {clinic.about && (
                        <p className="text-sm text-text-10 line-clamp-2 leading-relaxed">
                          {clinic.about}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="px-6 pb-6">
                      <Button 
                        className="w-full text-sm font-normal bg-main-10 text-main-100 hover:bg-main-100 hover:text-white"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClinicClick(clinic);
                        }}
                      >
                        Посмотреть клинику
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </NewDashboardLayout>
  );
};

