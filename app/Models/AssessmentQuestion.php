<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    protected $fillable = [
        'question',
        'self_assessment_id',
    ];

    public function assessment()
    {
        return $this->belongsTo(SelfAssessment::class);
    }
}
