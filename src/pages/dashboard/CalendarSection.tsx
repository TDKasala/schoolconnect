import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Réunion Parents-Professeurs',
      date: new Date(2024, 0, 15, 14, 0),
      duration: 120,
      location: 'Salle des professeurs',
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Examen de Mathématiques',
      date: new Date(2024, 0, 20, 8, 0),
      duration: 90,
      location: 'Salle 6A',
      type: 'exam',
      color: 'bg-red-500'
    },
    {
      id: 3,
      title: 'Sortie Éducative',
      date: new Date(2024, 0, 25, 9, 0),
      duration: 480,
      location: 'Musée National',
      type: 'activity',
      color: 'bg-green-500'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
        <p className="mt-2 text-gray-600">Gestion des événements et planning scolaire</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {dayNames.map(day => (
                <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((day, index) => (
                <div
                  key={index}
                  className={`bg-white p-2 min-h-20 border border-gray-100 ${
                    day ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
                >
                  {day && (
                    <div>
                      <div className="text-sm text-gray-900">{day}</div>
                      <div className="mt-1 space-y-1">
                        {getEventsForDay(day).slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs ${event.color} text-white rounded px-1 py-0.5 truncate`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {getEventsForDay(day).length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{getEventsForDay(day).length - 2} autres
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Événements à venir</h3>
              <button className="text-primary-600 hover:text-primary-700">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border-l-4 border-gray-200 pl-4">
                  <div className={`w-2 h-2 ${event.color} rounded-full mb-2`}></div>
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <div className="mt-1 text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.date.toLocaleDateString('fr-FR')} à {event.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700">
              <Plus className="h-4 w-4 inline mr-2" />
              Nouvel événement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
