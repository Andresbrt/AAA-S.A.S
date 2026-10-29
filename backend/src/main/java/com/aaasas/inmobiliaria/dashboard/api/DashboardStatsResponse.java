package com.aaasas.inmobiliaria.dashboard.api;

public record DashboardStatsResponse(
    long activeProjects,
    long availableLots,
    long soldLots,
    long newLeads
) {}
