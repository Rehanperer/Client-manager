import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Will be used for signup
    const signUp = (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    // Will be used for login
    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    // Will be used for logout
    const signOut = () => {
        return supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
