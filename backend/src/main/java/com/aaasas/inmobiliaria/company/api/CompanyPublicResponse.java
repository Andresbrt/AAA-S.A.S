package com.aaasas.inmobiliaria.company.api;

import java.util.List;

public record CompanyPublicResponse(CompanyInfoResponse company, List<TeamMemberResponse> team) {}
