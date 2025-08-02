-- Populate Sample Data for SchoolConnect Dashboard
-- This script adds sample data to the activity_logs, events, messages, and payments tables
-- Run this after creating the missing tables to have data in your dashboard

-- Get platform admin user ID for sample data
DO $$
DECLARE
    admin_user_id UUID;
    sample_school_id UUID;
    sample_student_id UUID;
    sample_teacher_id UUID;
BEGIN
    -- Get platform admin user
    SELECT id INTO admin_user_id 
    FROM public.users 
    WHERE role = 'platform_admin' 
    LIMIT 1;
    
    -- Get a sample school
    SELECT id INTO sample_school_id 
    FROM public.schools 
    LIMIT 1;
    
    -- Get a sample student
    SELECT id INTO sample_student_id 
    FROM public.students 
    LIMIT 1;
    
    -- Get a sample teacher
    SELECT id INTO sample_teacher_id 
    FROM public.users 
    WHERE role = 'teacher' 
    LIMIT 1;
    
    -- Only proceed if we have the required data
    IF admin_user_id IS NOT NULL AND sample_school_id IS NOT NULL THEN
    
        -- Insert sample activity logs
        INSERT INTO public.activity_logs (user_id, school_id, action, target, details, created_at) VALUES
        (admin_user_id, sample_school_id, 'user_created', 'Nouvel utilisateur créé: Marie Kabongo (Enseignante)', 
         jsonb_build_object('user_role', 'teacher', 'school_name', 'École Primaire'), 
         NOW() - INTERVAL '2 hours'),
        
        (admin_user_id, sample_school_id, 'school_updated', 'École mise à jour: École Primaire de Kinshasa', 
         jsonb_build_object('updated_fields', '["address", "phone"]'), 
         NOW() - INTERVAL '4 hours'),
        
        (admin_user_id, sample_school_id, 'payment_received', 'Paiement reçu: $150 USD - École Secondaire', 
         jsonb_build_object('amount', 150, 'currency', 'USD', 'payment_method', 'bank_transfer'), 
         NOW() - INTERVAL '6 hours'),
        
        (admin_user_id, sample_school_id, 'system_backup', 'Sauvegarde système effectuée avec succès', 
         jsonb_build_object('backup_size', '2.3GB', 'duration', '45 minutes'), 
         NOW() - INTERVAL '12 hours'),
        
        (admin_user_id, sample_school_id, 'user_approved', 'Utilisateur approuvé: Jean Mukendi (Enseignant)', 
         jsonb_build_object('user_role', 'teacher', 'approval_reason', 'Qualifications vérifiées'), 
         NOW() - INTERVAL '24 hours'),
        
        (admin_user_id, sample_school_id, 'school_created', 'Nouvelle école ajoutée: Institut Supérieur de Commerce', 
         jsonb_build_object('subscription_type', 'forfait', 'max_students', 500), 
         NOW() - INTERVAL '2 days'),
        
        (admin_user_id, sample_school_id, 'payment_overdue', 'Paiement en retard: École Technique - $200 USD', 
         jsonb_build_object('amount', 200, 'days_overdue', 15), 
         NOW() - INTERVAL '3 days'),
        
        (admin_user_id, sample_school_id, 'user_login', 'Connexion administrateur plateforme', 
         jsonb_build_object('ip_address', '192.168.1.100', 'location', 'Kinshasa'), 
         NOW() - INTERVAL '1 hour')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample events
        INSERT INTO public.events (school_id, created_by, title, description, start_date, end_date, location, event_type, status, visibility) VALUES
        (sample_school_id, admin_user_id, 'Réunion des enseignants', 
         'Réunion mensuelle pour discuter des programmes pédagogiques et des performances des élèves',
         NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
         'Salle de conférence', 'meeting', 'scheduled', 'school'),
        
        (sample_school_id, admin_user_id, 'Examen de Mathématiques - 6ème A', 
         'Examen trimestriel de mathématiques pour la classe de 6ème A',
         NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '2 hours',
         'Classe 6A', 'exam', 'scheduled', 'class'),
        
        (sample_school_id, admin_user_id, 'Journée portes ouvertes', 
         'Présentation de l''école aux futurs parents et élèves',
         NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week' + INTERVAL '6 hours',
         'École entière', 'activity', 'scheduled', 'public'),
        
        (sample_school_id, admin_user_id, 'Formation continue des enseignants', 
         'Session de formation sur les nouvelles méthodes pédagogiques',
         NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '4 hours',
         'Centre de formation', 'training', 'scheduled', 'school'),
        
        (sample_school_id, admin_user_id, 'Assemblée générale des parents', 
         'Réunion trimestrielle avec les parents d''élèves',
         NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '2 weeks' + INTERVAL '3 hours',
         'Auditorium', 'meeting', 'scheduled', 'school'),
        
        (sample_school_id, admin_user_id, 'Vacances de Noël', 
         'Période de vacances scolaires de fin d''année',
         NOW() + INTERVAL '1 month', NOW() + INTERVAL '1 month' + INTERVAL '2 weeks',
         'Toute l''école', 'holiday', 'scheduled', 'public')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample messages (if we have users)
        IF sample_teacher_id IS NOT NULL THEN
            INSERT INTO public.messages (sender_id, receiver_id, school_id, content, subject, type, is_read, created_at) VALUES
            (sample_teacher_id, admin_user_id, sample_school_id, 
             'Bonjour, j''ai une question concernant les frais de scolarité pour le prochain trimestre.',
             'Question sur les frais de scolarité', 'direct', FALSE, NOW() - INTERVAL '30 minutes'),
            
            (admin_user_id, sample_teacher_id, sample_school_id,
             'Les résultats des examens sont maintenant disponibles dans le système.',
             'Résultats d''examens disponibles', 'direct', TRUE, NOW() - INTERVAL '2 hours'),
            
            (sample_teacher_id, admin_user_id, sample_school_id,
             'Merci pour l''organisation de la réunion parents-enseignants.',
             'Remerciements', 'direct', TRUE, NOW() - INTERVAL '4 hours'),
            
            (admin_user_id, sample_teacher_id, sample_school_id,
             'Rappel: La formation pédagogique aura lieu vendredi prochain.',
             'Rappel formation', 'direct', FALSE, NOW() - INTERVAL '6 hours'),
            
            (sample_teacher_id, admin_user_id, sample_school_id,
             'Les documents d''inscription pour la nouvelle année sont-ils prêts?',
             'Documents d''inscription', 'direct', TRUE, NOW() - INTERVAL '8 hours')
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Insert sample payments (if we have students)
        IF sample_student_id IS NOT NULL THEN
            INSERT INTO public.payments (school_id, student_id, type, amount, currency, status, due_date, paid_date, description, payment_method, created_by) VALUES
            (sample_school_id, sample_student_id, 'school_fee', 150.00, 'USD', 'paid', 
             NOW() - INTERVAL '1 month', NOW() - INTERVAL '3 weeks', 
             'Frais de scolarité - Premier trimestre', 'bank_transfer', admin_user_id),
            
            (sample_school_id, sample_student_id, 'school_fee', 150.00, 'USD', 'pending', 
             NOW() + INTERVAL '1 month', NULL, 
             'Frais de scolarité - Deuxième trimestre', 'cash', admin_user_id),
            
            (sample_school_id, sample_student_id, 'registration', 50.00, 'USD', 'paid', 
             NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months', 
             'Frais d''inscription annuelle', 'mobile_money', admin_user_id),
            
            (sample_school_id, sample_student_id, 'other', 25.00, 'USD', 'overdue', 
             NOW() - INTERVAL '2 weeks', NULL, 
             'Frais de cantine scolaire', 'cash', admin_user_id),
            
            (sample_school_id, sample_student_id, 'school_fee', 150.00, 'USD', 'pending', 
             NOW() + INTERVAL '2 months', NULL, 
             'Frais de scolarité - Troisième trimestre', 'bank_transfer', admin_user_id)
            ON CONFLICT DO NOTHING;
        END IF;
        
        RAISE NOTICE 'Sample data inserted successfully!';
    ELSE
        RAISE NOTICE 'Required base data (admin user, school) not found. Please ensure you have at least one platform admin user and one school in your database.';
    END IF;
END $$;
